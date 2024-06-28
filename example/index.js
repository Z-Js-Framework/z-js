'use strict';

import { render } from '../index.js';
import About from './pages/about.js';
import Home from './pages/home.js';
import Layout from './pages/layout.js';

const root = document.querySelector('#root');

const routes = [
  {
    route: '/',
    component: Home,
  },
  {
    route: '/about',
    component: About,
  },
  {
    route: '/layout',
    component: Layout,
  },
];

console.log('Js enabled, z js rendering app...');

// render the app
render(root, routes);
