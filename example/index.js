'use strict';

import { render } from '../index.js';
import Home from './pages/home.js';

const root = document.querySelector('#root');

console.log('Js enabled, z js rendering app...');

render(root, Home);
