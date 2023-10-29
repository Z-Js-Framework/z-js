// Todo: more helper fucntions to simplify working with dom elements or components
// Todo: Loook Into Dom Mutation Obeservers - we can derive compoent mounted, unmounted and updated utilities to wire up into our reactive state system

// code for handling rendering of templates and ui
const componentsDirectory = './components';
/**
 * @type function - Z Js Function
 * @description A fetch function that fetches given component from components directory
 * @param {string} componentName - the name of the component to fetch
 * @returns  component content as html
 */
export async function fetchComponentContent(componentName) {
  const response = await fetch(`${componentsDirectory}/${componentName}.html`);

  if (response.ok) {
    let markup = await response.text();
    if (markup) {
      let fragment = document.createElement('div');
      fragment.innerHTML = markup;
      let template = fragment.querySelector('template');
      if (template) {
        let content = document.importNode(template.content, true);
        return content;
      }
    }
    return null;
  } else {
    console.log(
      `something happened when trying to get the component: ${componentName}`
    );
  }
}
/**
 * @type function - Z Js helper function
 * @description helper function that creates a new html element and returns it
 * @param {string} tagName
 * @param {object} Attributes
 * @returns  a newly created html element or component
 */
export function createComponent(tagName, Attributes) {
  let component = document.createElement(tagName);

  for (let key in Attributes) {
    component.setAttribute(key, Attributes[key]);
  }

  return component;
}

export function replaceComponent(oldComponent, newComponent) {
  oldComponent.parentNode.replaceChild(newComponent, oldComponent);
}

export function removeComponent(component) {
  component.parentNode.removeChild(component);
}

export function updateComponent(component, newContent) {
  component.innerHTML = newContent;
}

/**
 * @type function - Z Js helper function
 * @description helper function that takes parent element and returns an array of it's children
 * @param {Element} component
 * @returns an array of all component's child elements
 * @example let optionsArray = getChildren(selectElement);
 */
export function getChildren(component) {
  let childernArray = Array.from(component.children);

  return childernArray;
}
