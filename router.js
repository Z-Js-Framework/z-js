export function App(layout) {
  const { route, dynamic_route } = new Router(layout);

  const getPage = async (path_to_page) => {
    return fetch(path_to_page);
  };

  const getPages = async (path_to_pages_directory) => {
    return fetch(path_to_pages_directory);
  };

  return {
    route,
    dynamic_route,
    getPage,
    getPages,
  };
}

function Router(layout) {
  let routes = [];
  let view = layout.querySelector('slot');
  let currentRoute = '';

  const route = (path, page) => {
    routes.push({
      route: path,
      page: page,
    });
  };

  const dynamic_route = (special_path, pages) => {
    // a special path needs processing, it can look like '/blog:id'
    pages.forEach((page) => {
      routes.push({
        route: special_path,
        page: page,
      });
    });
  };

  return {
    route,
    dynamic_route,
  };
}
