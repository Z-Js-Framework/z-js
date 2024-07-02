'use strict';

import { render, useRouter } from '../index.js';
import About from './pages/about.js';
import Home from './pages/home.js';
import Layout from './pages/layout.js';
import NotFound from './pages/notFound.js';

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
  {
    route: '/*',
    component: NotFound,
  },
];

// todo: implement url params: /layout?blogId=123
// todo: implement nested routes

console.log('Js enabled, z js rendering app...');

// render the app
const _router = render(root, routes);
console.log('ROUTER 1', _router);
console.log('ROUTER 2', useRouter());
