import { APP_STATE } from './app-state.js';
import { Loader } from './components/loader.js';
import ZPage from './z/z.js';

// get all elements you want to work with in your Js
const homePage = document.querySelector('#homePage');
const addTodoButton = document.querySelector('#addTodoButton');
const UsernameElement = document.querySelector('.username');

// initialize Z instance with parent element and app state or initialState
const Z = new ZPage(homePage, APP_STATE);

// get state methods
const { state, setState, getState } = Z.stateManager();
console.log('App State:', state);

// Todo: remove need for spreading state while updating it
// Todo: add in custom effects to gracefully handle effects when state changes
addTodoButton.addEventListener('click', (e) => {
  // setState((state) => {...state, state.$user: 'Javascript'})
  setState((prevState) => ({ ...prevState, $user: 'Javascript' }));
  let currentState = getState();
  console.log('state after change', currentState);
});

UsernameElement.addEventListener('onUserChanged', (e) => {
  console.log('user change event detected');
});

// Z.replace(myAppId, Header({ username: 'Kizz' }));
// Z.append('after', myAppId, Footer);

// show a splash screen loader for 2 milli seconds
Z.showLoader(Loader, 2000);

// optional, logs whatever Z rendered in broswer to the console
// Z.log();
