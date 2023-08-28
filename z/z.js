import { useEventBus } from './useEventBus.js';
import { useStore } from './useStore.js';
import { _getContent, _makeHtml } from './utilities.js';

// Todo: accept element instead of element Id in methods!
// Todo: handle component visibility change, a method to hide or show a component

export default function ZPage(parentElement, appState) {
  // we will do something with the parent element
  let ZParent = parentElement;

  // intialize event bus and expose event methods
  const { eventsStore, eventSubscriptionHandler } = useEventBus(
    ZParent,
    appState
  );

  // intialize store and expose store methods
  const { store, setStore, getStoreValue } = useStore(
    appState,
    eventSubscriptionHandler
  );

  console.log(eventsStore);

  // define main state manager!
  const stateManager = () => {
    // do more stuff with state like hooking in events

    return { state: store, setState: setStore, getState: getStoreValue };
  };

  // * Note: if state manager subscribes, it gets called whenever state changes, this can be used to dispatch events and trigger reactivity in elements
  // subscribe(stateManager);

  // logs whatever was rendered in broswer to console
  const log = () => {
    console.log('What is rendered by Z Framework:', ZParent);
  };

  // sets the page parent element explicitly
  const setParent = (parentElement) => {
    ZParent = parentElement;
  };

  // renders givent component into given element
  const render = (elementID, component) => {
    let newContent = _getContent(component);

    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  // replaces given element with new component, - should remove old one!
  const replace = (elementID, component) => {
    let newContent = _getContent(component);

    let element = document.getElementById(elementID);
    element.innerHTML = '';
    element.innerHTML = newContent;
  };

  // appends an element to a given position in respect to passed in element
  const append = (order, elementID, component) => {
    let element = document.getElementById(elementID);

    let newContent = _getContent(component);

    if (order === 'after') {
      element.appendChild(_makeHtml(newContent));
    } else {
      // append new content element to before the current in elements
    }
  };

  // shows a loader component for given duration
  const showLoader = (component, duration) => {
    let newContent = _getContent(component);
    let newContentHtml = _makeHtml(newContent);
    newContentHtml.classList.add('z-loader');
    ZParent.appendChild(newContentHtml);

    // remove element after given time
    setTimeout(() => {
      let target = document.querySelector('.z-loader');
      target.style.display = 'none';
    }, duration);
  };

  // Z funtion exports exposed with Z.method syntax
  return { log, setParent, replace, append, render, showLoader, stateManager };
}
