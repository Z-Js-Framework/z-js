import { render } from '../rendering/index.js';

export const useRouter = (config = {}) => {
  // let parent = document.body;
  let parent = config.parent || document.body;
  let routes = config.routes || [];
  let initialDelay = config.initialDelay || 0;
  let currentRoute = null;

  const navigate = (urlPath = '', options = {}) => {
    let renderTarget = options.target || null;
    let routeCompoment = routes.find((r) => r.route === urlPath);
    let renderComponent = options.component || routeCompoment || null;

    if (renderComponent) {
      if (renderTarget) {
        history.pushState({}, '', urlPath);
        render(renderTarget, renderComponent);
      } else {
        history.pushState({}, '', urlPath);
        render(parent, renderComponent);
      }
      currentRoute = urlPath;
    } else {
      console.error(
        'Z Router, No component or configured route found for route: ',
        urlPath
      );
    }
  };

  const loadRouter = () => {
    // handle when no routes
    if (routes.length === 0) {
      console.error('Z Router, No routes configured');
      return;
    }

    // attach routes to links
    let links = parent.querySelectorAll('a');
    links.forEach((link) => {
      if (link.hasAttribute('no-mod') || !link.href.startsWith('/')) {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        let linkUrl = link.href;
        toggleActiveLink(links, link);
        if (link.hasAttribute('target') && link.getAttribute('target')) {
          let targetElement = document.getElementById(
            link.getAttribute('target')
          );
          if (targetElement) {
            render(targetElement, renderComponent);
          } else {
            console.error('Z Router, No target element found for link: ', link);
          }
        } else {
          navigate(linkUrl);
        }
      });
    });

    const toggleActiveLink = (links, link) => {
      links.forEach((_link) => {
        if (_link.href !== link.href) {
          _link.isActive = false;
        }
        link.isActive = true;
      });
    };

    // navigate for initial
    if (initialDelay !== 0) {
      setTimeout(() => {
        loadRouter();
      }, initialDelay);
    } else {
      navigate(routes[0].route);
    }

    // handle popState
    window.addEventListener('popstate', () => {
      let route = window.location.pathname;
      currentRoute = route;
      navigate(currentRoute);
    });
  };

  const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(param)) {
      return urlParams.get(param);
    } else {
      console.warn(`Param: ${param} not found in current url!`);
      return null;
    }
  };

  return {
    history: window.history,
    location: window.location,
    goTo: (route) => navigate(route),
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    getParam: getParam,
    loadRouter: loadRouter,
  };
};

// let route = {
//   route: '/',
//   component: null,
//   options: {},
// };
