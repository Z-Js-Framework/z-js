var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function render$1(parentElement, componentFunction) {
  parentElement.innerHTML = "";
  parentElement.appendChild(componentFunction());
}
function generateUniqueId(keyword = "", length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "1234567890";
  let id = keyword;
  const timestamp = Date.now();
  const randomChar = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
  if (!keyword) {
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  id += `_${timestamp}${randomChar}${randomNum}`;
  return id;
}
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash.toString(36);
}
const styleCache = /* @__PURE__ */ new Map();
let styleSheet;
function css(strings, ...values) {
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
  }
  const styleString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] || ""),
    ""
  );
  const className = "css-" + hashString(styleString);
  if (styleCache.has(className)) {
    return styleCache.get(className);
  }
  const rule = `.${className} { ${styleString} }`;
  styleSheet.innerHTML += rule;
  styleCache.set(className, className);
  return className;
}
var DOCUMENT_FRAGMENT_NODE = 11;
function morphAttrs(fromNode, toNode) {
  var toNodeAttrs = toNode.attributes;
  var attr;
  var attrName;
  var attrNamespaceURI;
  var attrValue;
  var fromValue;
  if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return;
  }
  for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
    attr = toNodeAttrs[i];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    attrValue = attr.value;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attr.prefix === "xmlns") {
          attrName = attr.name;
        }
        fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
      }
    } else {
      fromValue = fromNode.getAttribute(attrName);
      if (fromValue !== attrValue) {
        fromNode.setAttribute(attrName, attrValue);
      }
    }
  }
  var fromNodeAttrs = fromNode.attributes;
  for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
    attr = fromNodeAttrs[d];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
      }
    } else {
      if (!toNode.hasAttribute(attrName)) {
        fromNode.removeAttribute(attrName);
      }
    }
  }
}
var range;
var NS_XHTML = "http://www.w3.org/1999/xhtml";
var doc = typeof document === "undefined" ? void 0 : document;
var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
function createFragmentFromTemplate(str) {
  var template = doc.createElement("template");
  template.innerHTML = str;
  return template.content.childNodes[0];
}
function createFragmentFromRange(str) {
  if (!range) {
    range = doc.createRange();
    range.selectNode(doc.body);
  }
  var fragment = range.createContextualFragment(str);
  return fragment.childNodes[0];
}
function createFragmentFromWrap(str) {
  var fragment = doc.createElement("body");
  fragment.innerHTML = str;
  return fragment.childNodes[0];
}
function toElement(str) {
  str = str.trim();
  if (HAS_TEMPLATE_SUPPORT) {
    return createFragmentFromTemplate(str);
  } else if (HAS_RANGE_SUPPORT) {
    return createFragmentFromRange(str);
  }
  return createFragmentFromWrap(str);
}
function compareNodeNames(fromEl, toEl) {
  var fromNodeName = fromEl.nodeName;
  var toNodeName = toEl.nodeName;
  var fromCodeStart, toCodeStart;
  if (fromNodeName === toNodeName) {
    return true;
  }
  fromCodeStart = fromNodeName.charCodeAt(0);
  toCodeStart = toNodeName.charCodeAt(0);
  if (fromCodeStart <= 90 && toCodeStart >= 97) {
    return fromNodeName === toNodeName.toUpperCase();
  } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
    return toNodeName === fromNodeName.toUpperCase();
  } else {
    return false;
  }
}
function createElementNS(name, namespaceURI) {
  return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
}
function moveChildren(fromEl, toEl) {
  var curChild = fromEl.firstChild;
  while (curChild) {
    var nextChild = curChild.nextSibling;
    toEl.appendChild(curChild);
    curChild = nextChild;
  }
  return toEl;
}
function syncBooleanAttrProp(fromEl, toEl, name) {
  if (fromEl[name] !== toEl[name]) {
    fromEl[name] = toEl[name];
    if (fromEl[name]) {
      fromEl.setAttribute(name, "");
    } else {
      fromEl.removeAttribute(name);
    }
  }
}
var specialElHandlers = {
  OPTION: function(fromEl, toEl) {
    var parentNode = fromEl.parentNode;
    if (parentNode) {
      var parentName = parentNode.nodeName.toUpperCase();
      if (parentName === "OPTGROUP") {
        parentNode = parentNode.parentNode;
        parentName = parentNode && parentNode.nodeName.toUpperCase();
      }
      if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
        if (fromEl.hasAttribute("selected") && !toEl.selected) {
          fromEl.setAttribute("selected", "selected");
          fromEl.removeAttribute("selected");
        }
        parentNode.selectedIndex = -1;
      }
    }
    syncBooleanAttrProp(fromEl, toEl, "selected");
  },
  /**
   * The "value" attribute is special for the <input> element since it sets
   * the initial value. Changing the "value" attribute without changing the
   * "value" property will have no effect since it is only used to the set the
   * initial value.  Similar for the "checked" attribute, and "disabled".
   */
  INPUT: function(fromEl, toEl) {
    syncBooleanAttrProp(fromEl, toEl, "checked");
    syncBooleanAttrProp(fromEl, toEl, "disabled");
    if (fromEl.value !== toEl.value) {
      fromEl.value = toEl.value;
    }
    if (!toEl.hasAttribute("value")) {
      fromEl.removeAttribute("value");
    }
  },
  TEXTAREA: function(fromEl, toEl) {
    var newValue = toEl.value;
    if (fromEl.value !== newValue) {
      fromEl.value = newValue;
    }
    var firstChild = fromEl.firstChild;
    if (firstChild) {
      var oldValue = firstChild.nodeValue;
      if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
        return;
      }
      firstChild.nodeValue = newValue;
    }
  },
  SELECT: function(fromEl, toEl) {
    if (!toEl.hasAttribute("multiple")) {
      var selectedIndex = -1;
      var i = 0;
      var curChild = fromEl.firstChild;
      var optgroup;
      var nodeName;
      while (curChild) {
        nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
        if (nodeName === "OPTGROUP") {
          optgroup = curChild;
          curChild = optgroup.firstChild;
        } else {
          if (nodeName === "OPTION") {
            if (curChild.hasAttribute("selected")) {
              selectedIndex = i;
              break;
            }
            i++;
          }
          curChild = curChild.nextSibling;
          if (!curChild && optgroup) {
            curChild = optgroup.nextSibling;
            optgroup = null;
          }
        }
      }
      fromEl.selectedIndex = selectedIndex;
    }
  }
};
var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
function noop() {
}
function defaultGetNodeKey(node) {
  if (node) {
    return node.getAttribute && node.getAttribute("id") || node.id;
  }
}
function morphdomFactory(morphAttrs2) {
  return function morphdom2(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }
    if (typeof toNode === "string") {
      if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
        var toNodeHtml = toNode;
        toNode = doc.createElement("html");
        toNode.innerHTML = toNodeHtml;
      } else {
        toNode = toElement(toNode);
      }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child) {
      return parent.appendChild(child);
    };
    var childrenOnly = options.childrenOnly === true;
    var fromNodesLookup = /* @__PURE__ */ Object.create(null);
    var keyedRemovalList = [];
    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }
    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = void 0;
          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            addKeyedRemoval(key);
          } else {
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }
          curChild = curChild.nextSibling;
        }
      }
    }
    function removeNode(node, parentNode, skipKeyedNodes) {
      if (onBeforeNodeDiscarded(node) === false) {
        return;
      }
      if (parentNode) {
        parentNode.removeChild(node);
      }
      onNodeDiscarded(node);
      walkDiscardedChildNodes(node, skipKeyedNodes);
    }
    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }
          indexTree(curChild);
          curChild = curChild.nextSibling;
        }
      }
    }
    indexTree(fromNode);
    function handleNodeAdded(el) {
      onNodeAdded(el);
      var curChild = el.firstChild;
      while (curChild) {
        var nextSibling = curChild.nextSibling;
        var key = getNodeKey(curChild);
        if (key) {
          var unmatchedFromEl = fromNodesLookup[key];
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          handleNodeAdded(curChild);
        }
        curChild = nextSibling;
      }
    }
    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
          addKeyedRemoval(curFromNodeKey);
        } else {
          removeNode(
            curFromNodeChild,
            fromEl,
            true
            /* skip keyed nodes */
          );
        }
        curFromNodeChild = fromNextSibling;
      }
    }
    function morphEl(fromEl, toEl, childrenOnly2) {
      var toElKey = getNodeKey(toEl);
      if (toElKey) {
        delete fromNodesLookup[toElKey];
      }
      if (!childrenOnly2) {
        var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
        if (beforeUpdateResult === false) {
          return;
        } else if (beforeUpdateResult instanceof HTMLElement) {
          fromEl = beforeUpdateResult;
        }
        morphAttrs2(fromEl, toEl);
        onElUpdated(fromEl);
        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }
      if (fromEl.nodeName !== "TEXTAREA") {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }
    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;
      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;
      outer: while (curToNodeChild) {
        toNextSibling = curToNodeChild.nextSibling;
        curToNodeKey = getNodeKey(curToNodeChild);
        while (!skipFrom && curFromNodeChild) {
          fromNextSibling = curFromNodeChild.nextSibling;
          if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }
          curFromNodeKey = getNodeKey(curFromNodeChild);
          var curFromNodeType = curFromNodeChild.nodeType;
          var isCompatible = void 0;
          if (curFromNodeType === curToNodeChild.nodeType) {
            if (curFromNodeType === ELEMENT_NODE) {
              if (curToNodeKey) {
                if (curToNodeKey !== curFromNodeKey) {
                  if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                    if (fromNextSibling === matchingFromEl) {
                      isCompatible = false;
                    } else {
                      fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                      if (curFromNodeKey) {
                        addKeyedRemoval(curFromNodeKey);
                      } else {
                        removeNode(
                          curFromNodeChild,
                          fromEl,
                          true
                          /* skip keyed nodes */
                        );
                      }
                      curFromNodeChild = matchingFromEl;
                      curFromNodeKey = getNodeKey(curFromNodeChild);
                    }
                  } else {
                    isCompatible = false;
                  }
                }
              } else if (curFromNodeKey) {
                isCompatible = false;
              }
              isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
              if (isCompatible) {
                morphEl(curFromNodeChild, curToNodeChild);
              }
            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
              isCompatible = true;
              if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
              }
            }
          }
          if (isCompatible) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }
          if (curFromNodeKey) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
          }
          curFromNodeChild = fromNextSibling;
        }
        if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
          if (!skipFrom) {
            addChild(fromEl, matchingFromEl);
          }
          morphEl(matchingFromEl, curToNodeChild);
        } else {
          var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
          if (onBeforeNodeAddedResult !== false) {
            if (onBeforeNodeAddedResult) {
              curToNodeChild = onBeforeNodeAddedResult;
            }
            if (curToNodeChild.actualize) {
              curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
            }
            addChild(fromEl, curToNodeChild);
            handleNodeAdded(curToNodeChild);
          }
        }
        curToNodeChild = toNextSibling;
        curFromNodeChild = fromNextSibling;
      }
      cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
      var specialElHandler = specialElHandlers[fromEl.nodeName];
      if (specialElHandler) {
        specialElHandler(fromEl, toEl);
      }
    }
    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;
    if (!childrenOnly) {
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }
          return morphedNode;
        } else {
          morphedNode = toNode;
        }
      }
    }
    if (morphedNode === toNode) {
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }
      morphEl(morphedNode, toNode, childrenOnly);
      if (keyedRemovalList) {
        for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
          var elToRemove = fromNodesLookup[keyedRemovalList[i]];
          if (elToRemove) {
            removeNode(elToRemove, elToRemove.parentNode, false);
          }
        }
      }
    }
    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
      if (morphedNode.actualize) {
        morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
      }
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }
    return morphedNode;
  };
}
var morphdom = morphdomFactory(morphAttrs);
const trackedStates = /* @__PURE__ */ new Set();
const refs = /* @__PURE__ */ new Set();
let isRenderingList = false;
let refElements = [];
function html(strings, ...values) {
  const functions = [];
  const elements = [];
  !isRenderingList && trackedStates.clear();
  const valueHandlers = {
    function: handleFunction,
    HTMLElement: handleHTMLElement,
    Text: handleText,
    Array: handleArray,
    default: handleDefault
  };
  const fullString = strings.reduce((acc, str, i) => {
    if (i < values.length) {
      const value = values[i];
      const valueType = getValueType(value);
      const handler = valueHandlers[valueType];
      return acc + str + handler(value, i);
    }
    return acc + str;
  }, "");
  values.forEach((value, index) => {
    if (typeof value === "function") {
      functions.push({
        name: `__FUNCTION_${index}__`,
        fn: value
      });
    } else if (value instanceof HTMLElement) {
      const uniqueId = value.getAttribute("_id") || generateUniqueId("ELEMENT");
      value.setAttribute("_id", uniqueId);
      elements.push({
        name: uniqueId,
        element: value
      });
    }
  });
  function handleFunction(value, index) {
    return `__FUNCTION_${index}__`;
  }
  function handleHTMLElement(value) {
    const uniqueId = value.getAttribute("_id") || generateUniqueId("ELEMENT");
    value.setAttribute("_id", uniqueId);
    return `<div _id="${uniqueId}"></div>`;
  }
  function handleText(value) {
    return value.textContent;
  }
  function handleArray(value) {
    return value.map((item) => {
      if (item instanceof HTMLElement) return handleHTMLElement(item);
      if (item instanceof Text) return handleText(item);
      return escapeHTML(`${item}`);
    }).join("");
  }
  function handleDefault(value) {
    return value !== void 0 ? evalValue(value) : "";
  }
  function getValueType(value) {
    if (typeof value === "function") return "function";
    if (value instanceof HTMLElement) return "HTMLElement";
    if (value instanceof Text) return "Text";
    if (Array.isArray(value)) return "Array";
    return "default";
  }
  function evalValue(value) {
    if (typeof value === "object" && (value == null ? void 0 : value.type) === "LIST") {
      let placeholder = `<div list="${value.id}">list</div>`;
      let listRefExists = false;
      refs.forEach((ref) => {
        if (ref.ref === value.ref && ref.type === value.type) {
          listRefExists = true;
        }
      });
      if (!listRefExists) {
        refs.add({
          ref: value.ref,
          type: value.type,
          id: value.id,
          fn: value.fn
        });
      }
      return placeholder;
    }
    if (typeof value === "object" && value.hasOwnProperty("value")) {
      trackedStates.add(value);
      return value.current();
    } else if (Array.isArray(value)) {
      return value.map((item) => escapeHTML(`${item}`)).join("");
    } else {
      return escapeHTML(`${value}`);
    }
  }
  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  const rootElement = getRootElement$1(fullString);
  const element = createElement(
    buildStructure(rootElement, functions, elements),
    trackedStates
  );
  return element;
}
function getRootElement$1(fullString) {
  const parser = new DOMParser();
  let doc2;
  if (fullString.trim().match(/^<(tr|td|th|tbody|thead|tfoot)/i)) {
    doc2 = parser.parseFromString(`<table>${fullString}</table>`, "text/html");
    return doc2.querySelector("table").firstElementChild;
  } else {
    doc2 = parser.parseFromString(fullString, "text/html");
    return doc2.body.firstElementChild;
  }
}
function buildStructure(element, functions, elements) {
  if (element.nodeType === Node.TEXT_NODE) {
    return {
      type: "#text",
      content: element.textContent.trim(),
      attributes: {},
      children: [],
      elements
    };
  } else if (!(element == null ? void 0 : element.tagName)) {
    console.error("Invalid element:", element);
    return null;
  }
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions, elements);
  const content = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).join("");
  const children = Array.from(element.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE).map((node) => buildStructure(node, functions, elements));
  return {
    type: tag,
    content,
    attributes,
    children,
    elements
  };
}
function createElement(structure, trackedStates2) {
  const { type, content, attributes, children, elements } = structure;
  if (type === "#text") {
    return document.createTextNode(content);
  }
  const element = document.createElement(type);
  if (!element.hasAttribute("_id")) {
    const uniqueId = generateUniqueId("ELEMENT");
    element.setAttribute("_id", uniqueId);
    if (trackedStates2 && trackedStates2.size > 0) {
      trackedStates2.forEach((s) => s.elementInDom = uniqueId);
    }
  }
  if (content) {
    element.textContent = content;
  }
  for (const [key, value] of Object.entries(attributes)) {
    if (key === "ref") {
      let refExists = refElements.find((r) => r.ref === value);
      if (!refExists) {
        refElements.push({
          ref: value,
          element
        });
      } else {
        refElements = refElements.filter((r) => r.ref !== value);
        refElements.push({
          ref: value,
          element
        });
      }
    }
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (eventType === "change") {
        element.addEventListener("input", value);
      } else {
        element.addEventListener(eventType, value);
      }
    } else {
      element.setAttribute(key, value);
    }
  }
  if (children) {
    children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }
  Array.from(element.querySelectorAll("div[_id]")).forEach((placeholder) => {
    const id = placeholder.getAttribute("_id");
    const elementPlaceholder = elements.find((e) => e.name === id);
    if (elementPlaceholder) {
      placeholder.replaceWith(elementPlaceholder.element);
    }
  });
  return element;
}
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
function reactive(htmlFn) {
  const dom = htmlFn();
  if (trackedStates && trackedStates.size > 0) {
    trackedStates.forEach((state) => {
      state.subscribe(() => {
        let target = document.querySelector(`[_id="${state.elementInDom}"]`);
        let newElement = htmlFn();
        if (target) {
          updateDom(target, newElement);
        } else {
          console.error("component not found when re-rendering!");
        }
      });
    });
  }
  return dom;
}
function updateDom(fromNode, toNode, options = {}) {
  const defaultOptions = {};
  const finalOptions = { ...defaultOptions, ...options };
  morphdom(fromNode, toNode, finalOptions);
}
function List(props) {
  let list_id = generateUniqueId("LIST");
  const { ref, items, render: render2 } = props;
  isRenderingList = true;
  const renderList = (target) => {
    if (target) {
      let _items = items;
      if (items.value) {
        _items = items.value;
      }
      _items.forEach((item, index) => {
        const childElement = render2({ item, index });
        target.innerHtml = "";
        target.appendChild(childElement);
      });
      isRenderingList = false;
    } else {
      console.error("ref binding element not found when list!");
    }
  };
  return {
    type: "LIST",
    ref,
    id: list_id,
    fn: renderList
  };
}
function _getRef(ref) {
  let target = document.querySelector(`[ref="${ref}"]`) || null;
  !target && console.error(`ref not found: ${ref}`);
  return target;
}
function getRef(ref) {
  let target = null;
  refElements.forEach((r) => {
    if (r.ref === ref) {
      target = r.element;
    }
  });
  !target && console.error(`ref not found: ${ref}`);
  return target;
}
function init() {
  window.addEventListener("DOMContentLoaded", () => renderLists());
}
function renderLists() {
  refs.forEach((ref) => {
    if (ref.type === "LIST") {
      let target = _getRef(ref.ref);
      if (target) {
        ref.fn(target);
      }
    }
  });
  Array.from(document.querySelectorAll("div[list]")).forEach((placeholder) => {
    placeholder.remove();
  });
}
init();
function useSuspense(promise, fallback, options = {}) {
  const { retry = false, retryDelay = 1e3, maxRetries = 3 } = options;
  if (!(fallback instanceof HTMLElement)) {
    throw new Error("Fallback must be an HTML element");
  }
  const container = document.createElement("div");
  container.appendChild(fallback);
  let retryCount = 0;
  const loadContent = () => {
    promise().then((content) => {
      if (!(content instanceof HTMLElement)) {
        throw new Error("Suspense content must be a valid HTML element");
      }
      container.innerHTML = "";
      container.appendChild(content);
    }).catch((error) => {
      if (retry && retryCount < maxRetries) {
        retryCount++;
        setTimeout(loadContent, retryDelay);
      } else {
        console.warn(`Error loading suspense content: ${error}`);
      }
    });
  };
  loadContent();
  return container;
}
function StateRadio(options = {}) {
  let channels2 = [];
  let _plugins = options.plugins || [];
  let plugins = {};
  if (_plugins.length > 0) {
    _plugins.forEach((plugin) => {
      const name = plugin.name || "UnNamedPlugin";
      plugins[name] = plugin;
    });
  }
  let maxHistoryLimit = 10;
  const usePlugin = (channelName, pluginName) => {
    const plugin = plugins[pluginName] || null;
    if (plugin) {
      channels2[channelName].activePlugins.push(plugin);
      const exposedMethods = plugin.exposes || [];
      exposedMethods.forEach((item) => {
        channels2[channelName][item.name] = (...args) => item.method(channels2[channelName].state, ...args);
      });
      console.log(`Plugin '${pluginName}' added to channel '${channelName}'`);
    } else {
      console.error(
        `Plugin '${pluginName}' not found, make sure your using the correct plugin name!`
      );
    }
  };
  const getState = (channelName) => {
    return channels2[channelName].state;
  };
  const getHistory = (channelName) => {
    return channels2[channelName].history;
  };
  const getStateAuto = (channelName, options2) => {
    if ((options2 == null ? void 0 : options2.auto) ?? true) {
      let stateGetterCallback = () => channels2[channelName].state;
      subscribe(channelName, stateGetterCallback);
    }
    return channels2[channelName].state;
  };
  const getStateWithPlugins = (channelName, options2) => {
    const channel = channels2[channelName];
    let state = channel.state;
    for (const plugin of channel.activePlugins) {
      if (plugin.getter) {
        const pluginState = plugin.getter.method(state, plugin.getter.options);
        state = { ...state, ...pluginState };
      }
    }
    return getStateAuto(channelName, options2);
  };
  const setStateWithPlugins = (channelName, newState) => {
    const channel = channels2[channelName];
    let currentState = getState(channelName);
    let updatedState = newState;
    if (typeof newState === "function") {
      updatedState = newState(currentState);
    }
    for (const plugin of channel.activePlugins) {
      if (plugin.setter) {
        updatedState = plugin.setter.method(
          updatedState,
          plugin.setter.options
        );
      }
    }
    return stateSetter(channelName, updatedState);
  };
  const subscribe = (channelName, fn) => {
    channels2[channelName].subscribers.add(fn);
  };
  const addMiddleWares = (channelName, ...asyncFns) => {
    let oldMiddleWares = channels2[channelName].middleWares;
    channels2[channelName].middleWares = [...oldMiddleWares, ...asyncFns];
    return channels2[channelName].middleWares;
  };
  const notifySubscribers = (channelName) => {
    channels2[channelName].subscribers.forEach(
      (subscriber) => subscriber(channels2[channelName].state)
    );
  };
  const unSubscribe = (channelName, fn) => {
    channels2[channelName].subscribers.delete(fn);
  };
  const addChannel = (channelName, initialState = {}) => {
    channels2[channelName] = {
      name: channelName,
      activePlugins: [],
      subscribers: /* @__PURE__ */ new Set(),
      state: initialState,
      middleWares: [],
      history: [],
      setState: (newState) => setStateWithPlugins(channelName, newState),
      setStateAsync: (newState) => setStateAsync(channelName, newState),
      getState: (options2) => getStateWithPlugins(channelName, options2),
      getHistory: () => getHistory(channelName),
      addMiddleWares: (...callbackFns) => addMiddleWares(channelName, ...callbackFns),
      subscribe: (callbackFn) => subscribe(channelName, callbackFn),
      unSubscribe: (callbackFn) => unSubscribe(channelName, callbackFn),
      notifySubscribers: (channelName2) => notifySubscribers(channelName2),
      usePlugin: (pluginName) => usePlugin(channelName, pluginName)
    };
    return channels2[channelName];
  };
  const getChannel = (channelName) => {
    if (!channels2[channelName]) {
      console.error(`State Radio: ${channelName} channel not found!`);
      return null;
    }
    return channels2[channelName];
  };
  const removeChannel = (channelName) => {
    if (channels2[channelName]) {
      const updatedChannels = Object.keys(channels2).filter((key) => key !== channelName).reduce((obj, key) => {
        obj[key] = channels2[key];
        return obj;
      }, {});
      channels2 = updatedChannels;
    } else {
      console.error(`State Radio: ${channelName} channel does not exist!`);
    }
    return channels2;
  };
  const stateSetter = (channelName, newState) => {
    let currentState = getState(channelName);
    let _newState = newState;
    if (typeof newState === "function") {
      _newState = newState(currentState);
    }
    return setState(channelName, _newState);
  };
  const setState = (channelName, newState) => {
    let previousState = channels2[channelName].state;
    channels2[channelName].state = newState;
    if (channels2[channelName].history.length <= maxHistoryLimit) {
      channels2[channelName].history.push(previousState);
    } else {
      channels2[channelName].history = [];
      channels2[channelName].history.push(previousState);
    }
    notifySubscribers(channelName);
    return channels2[channelName].state;
  };
  const getChannels = () => channels2;
  const setStateAsync = async (channelName, newState) => {
    const channel = channels2[channelName];
    const composedAsyncChain = composeAsync(channel.middleWares, channelName);
    let currentState = getState(channelName);
    let _newState = newState;
    if (typeof newState === "function") {
      _newState = newState(currentState);
    }
    try {
      const newStateAfterMiddlewares = await composedAsyncChain(_newState);
      return setState(channelName, newStateAfterMiddlewares);
    } catch (error) {
      console.error("State update error, something happened:", error);
    }
  };
  const composeAsync = (functionsArray, channelName) => functionsArray.reduce(
    (currentFn, nextFn, index) => async (state, ...args) => {
      try {
        const result = await currentFn(state, ...args);
        return await nextFn(result, ...args);
      } catch (error) {
        console.error(
          `Error in middleware ${index} for channel ${channelName}:`,
          error
        );
        throw error;
      }
    }
  );
  return {
    channels: {
      getChannels,
      getChannel,
      addChannel,
      removeChannel
    }
  };
}
const { channels } = new StateRadio();
const radio = channels;
function useEffect(newFn, dependentStateChannels) {
  if (dependentStateChannels.length === 0) {
    window.addEventListener("DOMContentLoaded", newFn());
    return;
  }
  dependentStateChannels.forEach((channel) => {
    let targetChannel = radio.getChannel(channel.id);
    if (!targetChannel) {
      console.error("channel not found", channel);
      return;
    }
    targetChannel.subscribe(newFn);
  });
}
function useState(initialState) {
  let newStateId = generateUniqueId("state", 12);
  let channel = channels.addChannel(newStateId, initialState);
  const state = {
    id: newStateId,
    current: () => channel.getState(),
    subscribe: (fn) => channel.subscribe(fn),
    value: channel.getState()
  };
  const setState = channel.setState;
  return [state, setState, channel];
}
function createStore(initialState) {
  let newStateId = generateUniqueId("store", 12);
  let channel = channels.addChannel(newStateId, initialState);
  return {
    id: newStateId,
    setValue: channel.setState,
    getValue: () => channel.getState(),
    subscribe: (fn) => channel.subscribe(fn),
    channel
  };
}
function useStore(store) {
  const state = {
    id: store.id,
    current: () => store.getValue(),
    subscribe: (fn) => store.subscribe(fn),
    value: store.getValue
  };
  const setState = store.setValue;
  return [state, setState, store.channel];
}
class ZLink extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "_handleClick", (e) => {
      e.preventDefault();
      const path = this.getAttribute("to") || "/";
      const target = this.getAttribute("target");
      const event = new CustomEvent("z-navigate", {
        bubbles: true,
        detail: { path, target }
      });
      this.dispatchEvent(event);
    });
  }
  connectedCallback() {
    this.addEventListener("click", this._handleClick);
    this.style.cursor = "pointer";
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._handleClick);
  }
}
if (!customElements.get("z-link")) {
  customElements.define("z-link", ZLink);
}
function Router(config = {}) {
  const parent = config.parent || document.body;
  const routes = config.routes || [];
  const initialDelay = config.initialDelay || 0;
  const findMatchingRoute = (urlPath) => {
    const path = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
    if (path.endsWith("/index.html")) {
      return routes.find((r) => r.route === "/");
    }
    const exactMatch = routes.find((r) => r.route === path);
    if (exactMatch) return exactMatch;
    const wildcardRoute = routes.find((r) => r.route === "/*");
    return wildcardRoute;
  };
  const navigate = (urlPath, options = {}) => {
    const renderTarget = options.target || parent;
    const route = findMatchingRoute(urlPath);
    const renderComponent = options.component || (route == null ? void 0 : route.component);
    if (renderComponent) {
      let navigatePath = urlPath.endsWith("/index.html") ? "/" : urlPath;
      navigatePath = navigatePath.startsWith("/") ? navigatePath : `/${navigatePath}`;
      if (options.replaceState) {
        history.replaceState({}, "", navigatePath);
      } else {
        history.pushState({}, "", navigatePath);
      }
      render$1(renderTarget, renderComponent);
    } else {
      console.error("Z Router: No component found for route:", urlPath);
    }
  };
  const handleNavigation = (e) => {
    const { path, target } = e.detail;
    toggleActiveLink(e.target);
    if (target) {
      const targetElement = document.getElementById(target);
      if (targetElement) {
        navigate(path, { target: targetElement });
      } else {
        console.error("Z Router: No target element found for route:", path);
      }
    } else {
      navigate(path);
    }
  };
  const toggleActiveLink = (activeLink) => {
    parent.querySelectorAll("z-link").forEach((link) => {
      link.classList.toggle("active", link === activeLink);
    });
  };
  const attachLinkListeners = () => {
    parent.addEventListener("z-navigate", handleNavigation);
  };
  const handlePopState = () => {
    const path = window.location.pathname + window.location.search;
    navigate(path, { replaceState: true });
  };
  const handleInitialRoute = () => {
    const path = window.location.pathname + window.location.search;
    navigate(path, { replaceState: true });
  };
  const initRouter = () => {
    if (routes.length === 0) {
      console.error("Z Router: No routes configured");
      return;
    }
    attachLinkListeners();
    window.addEventListener("popstate", handlePopState);
    handleInitialRoute();
  };
  const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(param) ? urlParams.get(param) : null;
  };
  if (initialDelay > 0) {
    setTimeout(initRouter, initialDelay);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRouter);
  } else {
    initRouter();
  }
  return {
    history: window.history,
    location: window.location,
    goTo: navigate,
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    getParam,
    reloadRouter: initRouter
  };
}
let _router = null;
let _parentElement = null;
const render = (parentElement = null, routes = [], initialDelay = 0) => {
  if (!parentElement) {
    console.error("Root or parent element can't be empty, it is required!");
    return;
  }
  if (routes.length === 0) {
    console.error("Routes can't be empty, at least one is required!");
    return;
  }
  let initialRoute = routes.find((r) => r.route === "/");
  render$1(parentElement, initialRoute.component);
  if (parentElement && routes.length > 0) {
    _parentElement = parentElement;
    _router = new Router({
      routes,
      parent: parentElement,
      initialDelay
    });
  }
  return _router;
};
const useRouter = () => _router;
const getRootElement = () => _parentElement;
export {
  List,
  createStore,
  css,
  getRef,
  getRootElement,
  html,
  radio,
  reactive,
  render,
  useEffect,
  useRouter,
  useState,
  useStore,
  useSuspense
};
