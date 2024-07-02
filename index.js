import { render as _render, html, css } from './src/rendering/index.js';
import { useEffect, useState, store } from './src/store/index.js';
import { Router } from './src/routing/router.js';

let _router = null;

const render = (parentElement = null, routes = [], initialDelay = 0) => {
  if (!parentElement) {
    console.error("Root or parent element can't be empty, it is required!");
    return;
  }
  if (routes.length === 0) {
    console.error("Routes can't be empty, at least one is required!");
    return;
  }

  let initialRoute = routes.find((r) => r.route === '/');
  _render(parentElement, initialRoute.component);

  if (parentElement && routes.length > 0) {
    _router = new Router({
      routes: routes,
      parent: parentElement,
      initialDelay: initialDelay,
    });
  }

  return _router;
};

const useRouter = () => _router;

export { render, html, css, useEffect, useState, store, useRouter };
