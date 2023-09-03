import { syncLocalStorage } from './syncLocalStorage.js';
import { useEventBus } from './useEventBus.js';
import { _deepObjectCompare } from './utilities.js';

export function useStore(initialState) {
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
      store = getNextStoreValue();
      let callback = () =>
        eventManager.eventSubscriptionHandler(
          getPrevStoreValue(),
          getNextStoreValue()
        );
      subscribe(callback);
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

  // expose event methods
  const eventManager = useEventBus(getStoreValue, setStore);

  return { store, setStore, getStoreValue, subscribe, eventManager };
}
