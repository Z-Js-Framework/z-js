import ZEngine from './z/z.js';

export const Component = () => {
  const { state, setState, getState } = Z.stateManager({
    initialState: APP_STATE,
    persistStates: false,
  });

  return (
    <div>
      <h1>User Name:{getState().userName}</h1>
    </div>
  );
};
