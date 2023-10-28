import { syncLocalStorage } from './syncLocalStorage.js';
import { useEventBus } from './useEventBus.js';
import { _deepObjectCompare } from './utilities.js';

export function useStore(initialState, enableLocalStorage = false) {
  let store = initialState;

  // sync and return the initial localStorage state
  if (enableLocalStorage) {
    alert('local storage enabled!');
    let localState = syncLocalStorage(initialState);
    // define the store, local state overites any non local state
    store = { ...initialState, ...localState };
  }

  // define state listeners
  const listeners = new Set();

  // store modifying method
  // notice newState can be object or function that returns a new state object
  const setStore = (newState) => {
    let getPrevStoreValue = getStoreValue;
    let getNextStoreValue = () => {
      if (typeof newState === 'function') {
        return newState(getPrevStoreValue());
      } else {
        return newState;
      }
    };

    // don't modify state if nothing changed and subscribe event and state
    if (_deepObjectCompare(getPrevStoreValue(), getNextStoreValue())) {
      return;
    } else {
      let oldState = getPrevStoreValue();
      let latestState = getNextStoreValue();
      store = { ...oldState, ...latestState };
      let callback = () =>
        eventManager.eventSubscriptionHandler(oldState, latestState);
      subscribe(callback);
    }

    // sync store with local storage and notify all listeners of the changes in store!
    if (enableLocalStorage) {
      syncLocalStorage(getStoreValue());
    }
    listeners.forEach((listener) => listener());
  };

  // get current store value
  const getStoreValue = () => store;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // expose event methods
  const eventManager = useEventBus(getStoreValue, setStore);

  return { store, setStore, getStoreValue, subscribe, eventManager };
}
