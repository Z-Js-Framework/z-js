import App from 'zjs';
import { APP_STATE } from './app-state.js';
import { Loader } from './components/loader.html';
// get all elements you want to work with in your Js
const homePage = document.querySelector('#homePage');
const blogPage = document.querySelector('#blogPage');
const contactPage = document.querySelector('#contactPage');

const app = new App();

// create and add app routes
app.route('/', homePage);
app.route('/contact', contactPage);
app.route('/blog:id', blogPage);

// initialize app state, to make ui reactive
const { state, setState, getState } = app.stateManager({
  initialState: APP_STATE,
  persistStates: false,
});

// show a splash screen loader for 2 milli seconds
app.showLoader(Loader, 2000);
