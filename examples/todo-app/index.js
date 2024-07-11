'use strict';

import { render } from 'z-js-framework';
import TodosPage from './pages/todos';

const app = document.querySelector('#app');

const routes = [
  {
    route: '/',
    component: TodosPage,
  },
];

render(app, routes);
