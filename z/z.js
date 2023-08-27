import { makeHtml } from './utilities.js';

// Todo: accept element instead of element Id in methods!

export default function ZPage(parentElement) {
  // we will do something with the parent element
  let ZParent = parentElement;

  const log = () => {
    console.log('What is rendered by Z Framework:', ZParent);
  };

  const setParent = (parentElement) => {
    ZParent = parentElement;
  };

  const render = (elementID, component) => {
    let newContent = typeof component === 'function' ? component() : component;

    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  const replace = (elementID, component) => {
    let newContent = typeof component === 'function' ? component() : component;

    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  const append = (order, elementID, component) => {
    let element = document.getElementById(elementID);

    let newContent = typeof component === 'function' ? component() : component;

    if (order === 'after') {
      element.appendChild(makeHtml(newContent));
    } else {
      // append new content element to before the current in elements
    }
  };

  return { log, setParent, replace, append, render };
}
