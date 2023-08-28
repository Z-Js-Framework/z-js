import { syncLocalStorage } from './syncLocalStorage.js';

export function useStore(initialState, eventSubscriptionHandler) {
  // sync and return the initial localStorage state
  // let localState = syncLocalStorage(initialState);

  // define the store, local state overites any non local state
  // let store = { ...initialState, ...localState };
  let store = initialState;

  // define state listeners
  const listeners = new Set();

  // store modifying method
  // notice newState can be object or function that returns a new state object
  const setStore = (newState) => {
    let prevStoreValue = store;
    let nextStoreValue = {};

    if (typeof newState === 'function') {
      nextStoreValue = newState(prevStoreValue);

      // don't modify state if nothing changed and subscribe event and state
      if (prevStoreValue === nextStoreValue) {
        return;
      } else {
        store = nextStoreValue;
        let callback = () => eventSubscriptionHandler(prevStoreValue, store);
        subscribe(newState);
        subscribe(callback);
      }
    } else {
      nextStoreValue = newState;

      // still don't modify state if nothing changed and subscribe event only
      if (prevStoreValue === nextStoreValue) {
        return;
      } else {
        store = nextStoreValue;
        let callback = () => eventSubscriptionHandler(prevStoreValue, store);
        subscribe(callback);
      }
    }

    // sync store with local storage and notify all listeners of the changes in store!
    // syncLocalStorage(store);
    listeners.forEach((listener) => listener());
  };

  // get current store value
  const getStoreValue = () => store;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { store, setStore, getStoreValue, subscribe };
}
