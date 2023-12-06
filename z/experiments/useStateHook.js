export function useState(initialValue) {
  let state = initialValue;

  const setState = (newState) => {
    state = newState;
    // console.log(state);
  };
  return [state, setState];
}
