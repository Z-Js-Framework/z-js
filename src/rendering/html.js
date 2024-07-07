import { generateUniqueId } from '../utils/utilities.js';
import morphdom from '../libs/morphdom-esm@v2.7.3.js';

const trackedStates = new Set();

/**
 * Processes a tagged template literal and returns an HTML element.
 *
 * @param {TemplateStringsArray} strings - Template literal strings.
 * @param {...*} values - Template literal values.
 * @returns {HTMLElement} The created HTML element.
 */
export function html(strings, ...values) {
  // Store functions, states and elements separately for future use
  const functions = [];
  const elements = [];
  trackedStates.clear();

  // Construct the full string from the template literal parts
  const fullString = strings.reduce((acc, str, i) => {
    if (typeof values[i] === 'function') {
      return acc + str + `__FUNCTION_${i}__`;
    } else if (values[i] instanceof HTMLElement) {
      const uniqueId =
        values[i].getAttribute('_id') || generateUniqueId('ELEMENT');
      values[i].setAttribute('_id', uniqueId);
      return acc + str + `<div _id="${uniqueId}"></div>`;
    }
    return acc + str + (values[i] !== undefined ? evalValue(values[i]) : '');
  }, '');

  values.forEach((value, index) => {
    if (typeof value === 'function') {
      functions.push({
        name: `__FUNCTION_${index}__`,
        fn: value,
      });
    } else if (value instanceof HTMLElement) {
      const uniqueId = value.getAttribute('_id') || generateUniqueId('ELEMENT');
      value.setAttribute('_id', uniqueId);
      elements.push({
        name: uniqueId,
        element: value,
      });
    }
  });

  function evalValue(value) {
    if (typeof value === 'object' && value.hasOwnProperty('value')) {
      trackedStates.add(value);
      return value.current();
    } else {
      return value;
    }
  }

  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, 'text/html');
  const rootElement = doc.body.firstChild;
  const element = createElement(
    buildStructure(rootElement, functions, elements),
    trackedStates
  );

  return element;
}

/**
 * Recursively builds an abstract syntax tree (AST) structure from a DOM element.
 *
 * @param {HTMLElement} element - The DOM element to process.
 * @param {Array} functions - List of functions to associate with the element.
 * @param {Array} elements - List of elements to associate with the element.
 * @returns {Object} The AST structure representing the element.
 */
function buildStructure(element, functions, elements) {
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions, elements);
  const content = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');

  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .map((node) => buildStructure(node, functions, elements));

  return {
    type: tag,
    content: content,
    attributes: attributes,
    children: children,
    elements: elements,
  };
}

/**
 * Creates an HTML element from an AST structure.
 *
 * @param {Object} structure - The AST structure representing the element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createElement(structure, trackedStates) {
  const { type, content, attributes, children, elements } = structure;

  // Create the element
  const element = document.createElement(type);

  // Set a unique _id attribute if not already present
  if (!element.hasAttribute('_id')) {
    const uniqueId = generateUniqueId('ELEMENT');
    element.setAttribute('_id', uniqueId);
    if (trackedStates && trackedStates.size > 0) {
      trackedStates.forEach((s) => (s.elementInDom = uniqueId));
    }
  }

  // Set the content
  if (content) {
    element.textContent = content;
  }

  // Apply the attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      if (eventType === 'change') {
        element.addEventListener('input', value);
      } else {
        element.addEventListener(eventType, value);
      }
    } else {
      element.setAttribute(key, value);
    }
  }

  // Recursively create and append child elements
  if (children) {
    children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }

  // Replace placeholders with actual elements
  Array.from(element.querySelectorAll('div[_id]')).forEach((placeholder) => {
    const id = placeholder.getAttribute('_id');
    const elementPlaceholder = elements.find((e) => e.name === id);
    if (elementPlaceholder) {
      placeholder.replaceWith(elementPlaceholder.element);
    }
  });

  return element;
}

/**
 * Extracts attributes and their values from a DOM element.
 *
 * @param {HTMLElement} element - The DOM element to process.
 * @param {Array} functions - List of functions to associate with the element.
 * @param {Array} elements - List of elements to associate with the element.
 * @returns {Object} An object representing the element's attributes.
 */
function extractAttributes(element, functions, elements) {
  const attributes = {};
  Array.from(element.attributes).forEach((attr) => {
    const attrValue = attr.value.trim();
    const functionPlaceholder = functions.find((f) => f.name === attrValue);
    if (functionPlaceholder) {
      attributes[attr.name] = functionPlaceholder.fn;
    } else {
      const elementPlaceholder = elements.find((e) => e.name === attrValue);
      if (elementPlaceholder) {
        attributes[attr.name] = elementPlaceholder.name;
      } else {
        attributes[attr.name] = attr.value;
      }
    }
  });
  return attributes;
}

/**
 * Makes a component reactive by tracking state changes and updating the DOM accordingly.
 *
 * @param {Function} htmlFn - A function that returns the HTML structure of the component.
 *                            The function should reference reactive states which trigger re-renders.
 * @returns {HTMLElement} The DOM element or structure generated by the provided HTML function.
 *
 * @example
 * // Define a component using reactive state
 * export default function SomeComponent() {
 *   const [userName, setUserName] = useState('Kizz');
 *
 *   const SomeElement = () => html`
 *     <div>
 *       <h1>${userName}</h1>
 *       <input
 *         type="text"
 *         value="${userName}"
 *         onChange="${(e) => setUserName(event.target.value)}" />
 *     </div>`;
 *
 *   return reactive(SomeElement);
 * }
 */
export function reactive(htmlFn) {
  const dom = htmlFn();
  if (trackedStates && trackedStates.size > 0) {
    trackedStates.forEach((state) => {
      state.subscribe(() => {
        let target = document.querySelector(`[_id="${state.elementInDom}"]`);
        let newElement = htmlFn();
        if (target) {
          updateDom(target, newElement);
        } else {
          console.error('component not found when re-rendering!');
        }
      });
    });
  }
  return dom;
}

/**
 * updates the DOM using morphdom.
 *
 * @param {HTMLElement} fromNode - The source DOM node to be updated.
 * @param {HTMLElement} toNode - The target HTML DOM node representing the new content.
 * @param {Object} [options={}] - Optional configuration object to enable/disable specific morphdom options.
 */
function updateDom(fromNode, toNode, options = {}) {
  // Default options
  const defaultOptions = {};

  // Merge default options with custom options
  const finalOptions = { ...defaultOptions, ...options };

  // Perform the DOM update
  morphdom(fromNode, toNode, finalOptions);
}
