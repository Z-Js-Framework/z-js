const store = {};

const createStore = (initialState, key) => {
  const getState = () => store[key] && store[key].state;

  if (!store[key]) {
    store[key] = {
      state: initialState,
      listeners: new Set(),
    };
  }

  const listeners = store[key].listeners;

  const setState = (fn) => {
    let prevState = store[key].state;
    let nextState = typeof fn === 'function' ? fn(prevState) : fn;
    if (prevState === nextState) {
      return;
    }
    store[key].state = nextState;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
};

export const useStore = (initialStateOrKey) => {
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

  const [state, _setState] = useState(getState);

  useEffect(() => {
    const callback = () => {
      _setState((prevState) => {
        let nextState = getState();
        if (prevState === nextState) {
          return prevState;
        }
        return nextState;
      });
    };

    const unsubscribe = subscribe(callback);
    callback();
    return unsubscribe;
  }, [getState, subscribe]);

  return { state, setState };
};
