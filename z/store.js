import { syncLocalStorage } from './syncLocalStorage.js';

export function useStore(initialState) {
  let localState = syncLocalStorage(initialState);

  // define the store, local state overites any non local state
  let store = { ...initialState, ...localState };

  // store modifying method
  const setStore = () => {
    // deal with handling store changes
  };

  return { store, setStore };
}
