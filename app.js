'use strict';

import { App } from './router';
import { Loader } from './components/loader.html';

const homePage = document.querySelector('#homePage');

const app = new App(homePage);

const contactPage = app.getPage('./pages/contact.html');
const aboutPage = app.getPage('./pages/about.html');
const blogs = app.getPages('./pages/blog');

// create and add app routes
app.route('/', homePage);
app.route('/contact', contactPage);
app.route('/about', aboutPage);
app.dynamic_route('/blog:id', blogs);

const APP_STATE = {
  user: 'Kizz',
};

// initialize app state, to make ui reactive
const { state, setState, getState } = app.state({
  initialState: APP_STATE,
  persistStates: false,
});

// show a splash screen loader for 2 milli seconds
app.showLoader(Loader, 2000);
