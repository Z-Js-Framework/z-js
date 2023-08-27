export function syncLocalStorage(currentState, reset = null) {
  // define a special key for working with local storage unique to Z
  let localStorageKey = 'z-store';

  // prepare the state to persist
  let stateToPersist = [];

  // updated whenever this function is called
  let persistedState = {};

  // if clear is passed first clear all existing state
  if (reset === 'reset') {
    localStorage.clear();
  }

  try {
    let allStateKeys = Object.keys(currentState);
    let keysToPersist = allStateKeys.filter((key) => key.startsWith('$'));
    for (let key of keysToPersist) {
      let newPersistentState = { [key]: currentState[key] };
      stateToPersist = { ...stateToPersist, ...newPersistentState };
    }

    // check if state exists, if true update else create new state
    if (localStorage.getItem(localStorageKey)) {
      let oldLocalState = JSON.parse(localStorage.getItem(localStorageKey));
      let newLocalState = { ...oldLocalState, ...stateToPersist };
      localStorage.setItem(localStorageKey, JSON.stringify(newLocalState));
      persistedState = JSON.parse(localStorage.getItem(localStorageKey));
    } else {
      // create new
      localStorage.setItem(localStorageKey, JSON.stringify(stateToPersist));
      persistedState = JSON.parse(localStorage.getItem(localStorageKey));
    }
  } catch (error) {
    console.error(`Error Persisting State: ${error}`);
  }

  return persistedState;
}
