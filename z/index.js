import { makeHtml } from './utilities';

export default function Z() {
  let ZParent;

  const log = () => {
    console.log('Hello Z Framework!');
  };

  const setParent = (parentElement) => {
    ZParent = parentElement;
  };

  const replace = (elementID, newContent) => {
    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  const append = (order, elementID, newContent) => {
    let element = document.getElementById(elementID);

    if (order === 'after') {
      element.appendChild(makeHtml(newContent));
    } else {
      // append new content element to before the current in elements
    }
  };

  return { log, setParent, replace, append };
}
