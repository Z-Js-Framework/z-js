function StateRadio$1(options = {}) {
  let channels = [];
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
      channels[channelName].activePlugins.push(plugin);
      const exposedMethods = plugin.exposes || [];
      exposedMethods.forEach((item) => {
        channels[channelName][item.name] = (...args) => item.method(channels[channelName].state, ...args);
      });
      console.log(`Plugin '${pluginName}' added to channel '${channelName}'`);
    } else {
      console.error(
        `Plugin '${pluginName}' not found, make sure your using the correct plugin name!`
      );
    }
  };
  const getState = (channelName) => {
    return channels[channelName].state;
  };
  const getHistory = (channelName) => {
    return channels[channelName].history;
  };
  const getStateAuto = (channelName, options2) => {
    if ((options2 == null ? void 0 : options2.auto) ?? true) {
      let stateGetterCallback = () => channels[channelName].state;
      subscribe(channelName, stateGetterCallback);
    }
    return channels[channelName].state;
  };
  const getStateWithPlugins = (channelName, options2) => {
    const channel = channels[channelName];
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
    const channel = channels[channelName];
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
    channels[channelName].subscribers.add(fn);
  };
  const addMiddleWares = (channelName, ...asyncFns) => {
    let oldMiddleWares = channels[channelName].middleWares;
    channels[channelName].middleWares = [...oldMiddleWares, ...asyncFns];
    return channels[channelName].middleWares;
  };
  const notifySubscribers = (channelName) => {
    channels[channelName].subscribers.forEach(
      (subscriber) => subscriber(channels[channelName].state)
    );
  };
  const unSubscribe = (channelName, fn) => {
    channels[channelName].subscribers.delete(fn);
  };
  const addChannel = (channelName, initialState = {}) => {
    channels[channelName] = {
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
    return channels[channelName];
  };
  const getChannel = (channelName) => {
    if (!channels[channelName]) {
      console.error(`State Radio: ${channelName} channel not found!`);
      return null;
    }
    return channels[channelName];
  };
  const removeChannel = (channelName) => {
    if (channels[channelName]) {
      const updatedChannels = Object.keys(channels).filter((key) => key !== channelName).reduce((obj, key) => {
        obj[key] = channels[key];
        return obj;
      }, {});
      channels = updatedChannels;
    } else {
      console.error(`State Radio: ${channelName} channel does not exist!`);
    }
    return channels;
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
    let previousState = channels[channelName].state;
    channels[channelName].state = newState;
    if (channels[channelName].history.length <= maxHistoryLimit) {
      channels[channelName].history.push(previousState);
    } else {
      channels[channelName].history = [];
      channels[channelName].history.push(previousState);
    }
    notifySubscribers(channelName);
    return channels[channelName].state;
  };
  const getChannels = () => channels;
  const setStateAsync = async (channelName, newState) => {
    const channel = channels[channelName];
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
const StateRadio = StateRadio$1;
export {
  StateRadio
};
