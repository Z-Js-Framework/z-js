const valueShower = document.querySelector('#valueShower');
const incrementBtn = document.querySelector('#incrementBtn');

// const store = {};

function createStore(initialState, key) {
  const listeners = new Set();
  let state = initialState;

  const getState = () => state;

  const setState = (newState) => {
    if (state === newState) {
      return;
    }
    state = newState;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}

function useStore(initialStateOrKey) {
  const isInitialState = typeof initialStateOrKey === 'object';
  const defaultState = isInitialState
    ? Object.values(initialStateOrKey)[0]
    : undefined;
  const key = isInitialState
    ? Object.keys(initialStateOrKey)[0]
    : initialStateOrKey;

  const { getState, setState, subscribe } = createStore(defaultState, key);

  if (isInitialState && !defaultState) {
    throw new Error('State should be declared before being used.');
  }

  let store = getState();

  const setStore = (newState) => {
    setState((prevState) => {
      const nextState =
        typeof newState === 'function' ? newState(prevState) : newState;
      if (prevState === nextState) {
        return prevState;
      }
      return nextState;
    });
  };

  const callback = () => {
    const nextState = getState();
    if (state !== nextState) {
      store = nextState;
      setState(nextState);
    }
  };

  const unsubscribe = subscribe(callback);
  callback();

  return { store, setStore };
}

const { store, setStore } = useStore({ count: 0 });

valueShower.textContent = `Value: ${store.count}`;

incrementBtn.addEventListener('click', () => {
  setStore((prevState) => ({ count: prevState.count + 1 }));
});
