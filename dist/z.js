var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function render$1(parentElement, componentFunction) {
  parentElement.innerHTML = "";
  parentElement.appendChild(componentFunction());
}
function generateUniqueId(keyword = "", length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "1234567890";
  let id = keyword;
  const timestamp = Date.now();
  const randomChar = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
  if (!keyword) {
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  id += `_${timestamp}${randomChar}${randomNum}`;
  return id;
}
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash.toString(36);
}
const styleCache = /* @__PURE__ */ new Map();
let styleSheet;
function css(strings, ...values) {
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
  }
  const styleString = strings.reduce(
    (acc, str, i) => acc + str + (values[i] || ""),
    ""
  );
  const className = "css-" + hashString(styleString);
  if (styleCache.has(className)) {
    return styleCache.get(className);
  }
  const rule = `.${className} { ${styleString} }`;
  styleSheet.innerHTML += rule;
  styleCache.set(className, className);
  return className;
}
const trackedStates = /* @__PURE__ */ new Set();
function html(strings, ...values) {
  const functions = [];
  const elements = [];
  trackedStates.clear();
  const fullString = strings.reduce((acc, str, i) => {
    if (typeof values[i] === "function") {
      return acc + str + `__FUNCTION_${i}__`;
    } else if (values[i] instanceof HTMLElement) {
      const uniqueId = values[i].getAttribute("_id") || generateUniqueId("ELEMENT");
      values[i].setAttribute("_id", uniqueId);
      return acc + str + `<div _id="${uniqueId}"></div>`;
    }
    return acc + (values[i] !== void 0 ? evalValue(values[i], str) : "");
  }, "");
  values.forEach((value, index) => {
    if (typeof value === "function") {
      functions.push({
        name: `__FUNCTION_${index}__`,
        fn: value
      });
    } else if (value instanceof HTMLElement) {
      const uniqueId = value.getAttribute("_id") || generateUniqueId("ELEMENT");
      value.setAttribute("_id", uniqueId);
      elements.push({
        name: uniqueId,
        element: value
      });
    }
  });
  function evalValue(value, str) {
    let newPartialString = str;
    if (typeof value === "object" && value.hasOwnProperty("value")) {
      if (str.includes("stateful")) {
        newPartialString = str.replace(
          "stateful",
          `stateful="${value.id}"`
        );
      }
      trackedStates.add(value);
      console.log("stateful", newPartialString);
      return newPartialString + value.current();
    } else {
      return newPartialString + value;
    }
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullString, "text/html");
  const rootElement = doc.body.firstChild;
  const element = createElement(
    buildStructure(rootElement, functions, elements),
    trackedStates
  );
  return element;
}
function buildStructure(element, functions, elements) {
  const tag = element.tagName.toLowerCase();
  const attributes = extractAttributes(element, functions, elements);
  const content = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).join("");
  const children = Array.from(element.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE).map((node) => buildStructure(node, functions, elements));
  return {
    type: tag,
    content,
    attributes,
    children,
    elements
  };
}
function createElement(structure, trackedStates2) {
  const { type, content, attributes, children, elements } = structure;
  const element = document.createElement(type);
  if (!element.hasAttribute("_id")) {
    const uniqueId = generateUniqueId("ELEMENT");
    element.setAttribute("_id", uniqueId);
    if (trackedStates2 && trackedStates2.size > 0) {
      trackedStates2.forEach((s) => s.elementInDom = uniqueId);
    }
  }
  if (content) {
    element.textContent = content;
  }
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (eventType === "change") {
        element.addEventListener("input", value);
      } else {
        element.addEventListener(eventType, value);
      }
    } else {
      element.setAttribute(key, value);
    }
  }
  if (children) {
    children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }
  Array.from(element.querySelectorAll("div[_id]")).forEach((placeholder) => {
    const id = placeholder.getAttribute("_id");
    const elementPlaceholder = elements.find((e) => e.name === id);
    if (elementPlaceholder) {
      placeholder.replaceWith(elementPlaceholder.element);
    }
  });
  return element;
}
function extractAttributes(element, functions, elements) {
  const attributes = {};
  Array.from(element.attributes).forEach((attr) => {
    const attrValue = attr.value.trim();
    const functionPlaceholder = functions.find((f) => f.name === attrValue);
    if (functionPlaceholder) {
      attributes[attr.name] = functionPlaceholder.fn;
    } else {
      const elementPlaceholder = elements.find((e) => e.name === attrValue);
      if (elementPlaceholder) {
        attributes[attr.name] = elementPlaceholder.name;
      } else {
        attributes[attr.name] = attr.value;
      }
    }
  });
  return attributes;
}
function $(htmlFn) {
  const dom = htmlFn();
  console.log("states::", trackedStates);
  if (trackedStates && trackedStates.size > 0) {
    trackedStates.forEach((state) => {
      state.subscribe(() => {
        console.log("state changed, re-rendering:", state.elementInDom);
        let target = document.querySelector(`[_id="${state.elementInDom}"]`);
        let newElement = htmlFn();
        console.log("new element:", newElement);
        if (target) {
          target.replaceWith(newElement);
        } else {
          console.error("component not found when re-rendering!");
        }
      });
    });
  }
  return dom;
}
function StateRadio(options = {}) {
  let channels2 = [];
  let _plugins = options.plugins || [];
  let plugins = {};
  if (_plugins.length > 0) {
    _plugins.forEach((plugin) => {
      const name = plugin.name || "UnNamedPlugin";
      plugins[name] = plugin;
    });
  }
  let maxHistoryLimit = 10;
  const usePlugin = (channelName, pluginName) => {
    const plugin = plugins[pluginName] || null;
    if (plugin) {
      channels2[channelName].activePlugins.push(plugin);
      const exposedMethods = plugin.exposes || [];
      exposedMethods.forEach((item) => {
        channels2[channelName][item.name] = (...args) => item.method(channels2[channelName].state, ...args);
      });
      console.log(`Plugin '${pluginName}' added to channel '${channelName}'`);
    } else {
      console.error(
        `Plugin '${pluginName}' not found, make sure your using the correct plugin name!`
      );
    }
  };
  const getState = (channelName) => {
    return channels2[channelName].state;
  };
  const getHistory = (channelName) => {
    return channels2[channelName].history;
  };
  const getStateAuto = (channelName, options2) => {
    if ((options2 == null ? void 0 : options2.auto) ?? true) {
      let stateGetterCallback = () => channels2[channelName].state;
      subscribe(channelName, stateGetterCallback);
    }
    return channels2[channelName].state;
  };
  const getStateWithPlugins = (channelName, options2) => {
    const channel = channels2[channelName];
    let state = channel.state;
    for (const plugin of channel.activePlugins) {
      if (plugin.getter) {
        const pluginState = plugin.getter.method(state, plugin.getter.options);
        state = { ...state, ...pluginState };
      }
    }
    return getStateAuto(channelName, options2);
  };
  const setStateWithPlugins = (channelName, newState) => {
    const channel = channels2[channelName];
    let currentState = getState(channelName);
    let updatedState = newState;
    if (typeof newState === "function") {
      updatedState = newState(currentState);
    }
    for (const plugin of channel.activePlugins) {
      if (plugin.setter) {
        updatedState = plugin.setter.method(
          updatedState,
          plugin.setter.options
        );
      }
    }
    return stateSetter(channelName, updatedState);
  };
  const subscribe = (channelName, fn) => {
    channels2[channelName].subscribers.add(fn);
  };
  const addMiddleWares = (channelName, ...asyncFns) => {
    let oldMiddleWares = channels2[channelName].middleWares;
    channels2[channelName].middleWares = [...oldMiddleWares, ...asyncFns];
    return channels2[channelName].middleWares;
  };
  const notifySubscribers = (channelName) => {
    channels2[channelName].subscribers.forEach(
      (subscriber) => subscriber(channels2[channelName].state)
    );
  };
  const unSubscribe = (channelName, fn) => {
    channels2[channelName].subscribers.delete(fn);
  };
  const addChannel = (channelName, initialState = {}) => {
    channels2[channelName] = {
      name: channelName,
      activePlugins: [],
      subscribers: /* @__PURE__ */ new Set(),
      state: initialState,
      middleWares: [],
      history: [],
      setState: (newState) => setStateWithPlugins(channelName, newState),
      setStateAsync: (newState) => setStateAsync(channelName, newState),
      getState: (options2) => getStateWithPlugins(channelName, options2),
      getHistory: () => getHistory(channelName),
      addMiddleWares: (...callbackFns) => addMiddleWares(channelName, ...callbackFns),
      subscribe: (callbackFn) => subscribe(channelName, callbackFn),
      unSubscribe: (callbackFn) => unSubscribe(channelName, callbackFn),
      notifySubscribers: (channelName2) => notifySubscribers(channelName2),
      usePlugin: (pluginName) => usePlugin(channelName, pluginName)
    };
    return channels2[channelName];
  };
  const getChannel = (channelName) => {
    if (!channels2[channelName]) {
      console.error(`State Radio: ${channelName} channel not found!`);
      return null;
    }
    return channels2[channelName];
  };
  const removeChannel = (channelName) => {
    if (channels2[channelName]) {
      const updatedChannels = Object.keys(channels2).filter((key) => key !== channelName).reduce((obj, key) => {
        obj[key] = channels2[key];
        return obj;
      }, {});
      channels2 = updatedChannels;
    } else {
      console.error(`State Radio: ${channelName} channel does not exist!`);
    }
    return channels2;
  };
  const stateSetter = (channelName, newState) => {
    let currentState = getState(channelName);
    let _newState = newState;
    if (typeof newState === "function") {
      _newState = newState(currentState);
    }
    return setState(channelName, _newState);
  };
  const setState = (channelName, newState) => {
    let previousState = channels2[channelName].state;
    channels2[channelName].state = newState;
    if (channels2[channelName].history.length <= maxHistoryLimit) {
      channels2[channelName].history.push(previousState);
    } else {
      channels2[channelName].history = [];
      channels2[channelName].history.push(previousState);
    }
    notifySubscribers(channelName);
    return channels2[channelName].state;
  };
  const getChannels = () => channels2;
  const setStateAsync = async (channelName, newState) => {
    const channel = channels2[channelName];
    const composedAsyncChain = composeAsync(channel.middleWares, channelName);
    let currentState = getState(channelName);
    let _newState = newState;
    if (typeof newState === "function") {
      _newState = newState(currentState);
    }
    try {
      const newStateAfterMiddlewares = await composedAsyncChain(_newState);
      return setState(channelName, newStateAfterMiddlewares);
    } catch (error) {
      console.error("State update error, something happened:", error);
    }
  };
  const composeAsync = (functionsArray, channelName) => functionsArray.reduce(
    (currentFn, nextFn, index) => async (state, ...args) => {
      try {
        const result = await currentFn(state, ...args);
        return await nextFn(result, ...args);
      } catch (error) {
        console.error(
          `Error in middleware ${index} for channel ${channelName}:`,
          error
        );
        throw error;
      }
    }
  );
  return {
    channels: {
      getChannels,
      getChannel,
      addChannel,
      removeChannel
    }
  };
}
const { channels } = new StateRadio();
const store = channels;
function useEffect(newFn, dependentStateChannels) {
  if (dependentStateChannels.length === 0) {
    window.addEventListener("DOMContentLoaded", newFn());
    return;
  }
  dependentStateChannels.forEach((channel) => {
    let targetChannel = store.getChannel(channel.id);
    if (!targetChannel) {
      console.error("channel not found", channel);
      return;
    }
    targetChannel.subscribe(newFn);
  });
}
function useState(initialState) {
  let newStateId = generateUniqueId("state", 12);
  let channel = channels.addChannel(newStateId, initialState);
  const state = {
    id: newStateId,
    current: () => channel.getState(),
    subscribe: (fn) => channel.subscribe(fn),
    value: channel.getState()
  };
  const setState = channel.setState;
  return [state, setState, channel];
}
class ZLink extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "_handleClick", (e) => {
      e.preventDefault();
      const path = this.getAttribute("to") || "/";
      const target = this.getAttribute("target");
      const event = new CustomEvent("z-navigate", {
        bubbles: true,
        detail: { path, target }
      });
      this.dispatchEvent(event);
    });
  }
  connectedCallback() {
    this.addEventListener("click", this._handleClick);
    this.style.cursor = "pointer";
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._handleClick);
  }
}
customElements.define("z-link", ZLink);
function Router(config = {}) {
  const parent = config.parent || document.body;
  const routes = config.routes || [];
  const initialDelay = config.initialDelay || 0;
  const findMatchingRoute = (urlPath) => {
    const path = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
    if (path.endsWith("/index.html")) {
      return routes.find((r) => r.route === "/");
    }
    const exactMatch = routes.find((r) => r.route === path);
    if (exactMatch) return exactMatch;
    const wildcardRoute = routes.find((r) => r.route === "/*");
    return wildcardRoute;
  };
  const navigate = (urlPath, options = {}) => {
    const renderTarget = options.target || parent;
    const route = findMatchingRoute(urlPath);
    const renderComponent = options.component || (route == null ? void 0 : route.component);
    if (renderComponent) {
      let navigatePath = urlPath.endsWith("/index.html") ? "/" : urlPath;
      navigatePath = navigatePath.startsWith("/") ? navigatePath : `/${navigatePath}`;
      if (options.replaceState) {
        history.replaceState({}, "", navigatePath);
      } else {
        history.pushState({}, "", navigatePath);
      }
      render$1(renderTarget, renderComponent);
    } else {
      console.error("Z Router: No component found for route:", urlPath);
    }
  };
  const handleNavigation = (e) => {
    const { path, target } = e.detail;
    toggleActiveLink(e.target);
    if (target) {
      const targetElement = document.getElementById(target);
      if (targetElement) {
        navigate(path, { target: targetElement });
      } else {
        console.error("Z Router: No target element found for route:", path);
      }
    } else {
      navigate(path);
    }
  };
  const toggleActiveLink = (activeLink) => {
    parent.querySelectorAll("z-link").forEach((link) => {
      link.classList.toggle("active", link === activeLink);
    });
  };
  const attachLinkListeners = () => {
    parent.addEventListener("z-navigate", handleNavigation);
  };
  const handlePopState = () => {
    const path = window.location.pathname + window.location.search;
    navigate(path, { replaceState: true });
  };
  const handleInitialRoute = () => {
    const path = window.location.pathname + window.location.search;
    navigate(path, { replaceState: true });
  };
  const initRouter = () => {
    if (routes.length === 0) {
      console.error("Z Router: No routes configured");
      return;
    }
    attachLinkListeners();
    window.addEventListener("popstate", handlePopState);
    handleInitialRoute();
  };
  const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(param) ? urlParams.get(param) : null;
  };
  if (initialDelay > 0) {
    setTimeout(initRouter, initialDelay);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRouter);
  } else {
    initRouter();
  }
  return {
    history: window.history,
    location: window.location,
    goTo: navigate,
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    getParam,
    reloadRouter: initRouter
  };
}
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
  let initialRoute = routes.find((r) => r.route === "/");
  render$1(parentElement, initialRoute.component);
  if (parentElement && routes.length > 0) {
    _router = new Router({
      routes,
      parent: parentElement,
      initialDelay
    });
  }
  return _router;
};
const useRouter = () => _router;
export {
  $,
  css,
  html,
  render,
  store,
  useEffect,
  useRouter,
  useState
};
