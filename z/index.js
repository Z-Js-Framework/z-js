import { makeHtml } from './utilities.js';

function ZEngine() {
  let ZParent;

  const log = () => {
    console.log('Hello Z Framework!');
  };

  this.setParent = (parentElement) => {
    ZParent = parentElement;
  };

  this.replace = (elementID, newContent) => {
    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  this.append = (order, elementID, newContent) => {
    let element = document.getElementById(elementID);

    if (order === 'after') {
      element.appendChild(makeHtml(newContent));
    } else {
      // append new content element to before the current in elements
    }
  };

  // return { log, setParent, replace, append };
}

const Z = new ZEngine();

export default Z;
