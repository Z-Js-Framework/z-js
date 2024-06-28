import { render as _render, html, css } from './src/rendering/index.js';
import { useEffect, useState, store } from './src/store/index.js';
import { useRouter } from './src/routing/router.js';

let _routes = [];
let _parent = null;
let _initialDelay = 0;
let _router = null;

const render = (parentElement, routes = [], initialDelay = 0) => {
  _parent = parentElement;
  _routes = routes;
  _initialDelay = initialDelay;

  if (_routes.length === 0) {
    console.error("Routes can't be empty, at least one is required!");
    return;
  }
  let initialRoute = _routes.find((r) => r.route === '/');
  _render(_parent, initialRoute.component);
};

if (_parent && _routes.length > 0) {
  _router = useRouter({
    routes: _routes,
    parent: _parent,
    initialDelay: _initialDelay,
  });
}

if (_router) {
  _router.loadRouter();
}
const router = _router;

export { render, html, css, useEffect, useState, store, router };
