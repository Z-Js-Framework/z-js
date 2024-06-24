// State Radio - State Manager Library v1.0.0
// By Hussein Kizz, Last Modified 29-01-2024

export function StateRadio(options = {}) {
  let channels = [];
  let _plugins = options.plugins || [];
  let plugins = {};

  // Modify and store plugins
  if (_plugins.length > 0) {
    _plugins.forEach((plugin) => {
      const name = plugin.name || 'UnNamedPlugin';
      plugins[name] = plugin;
    });
  }

  // console.log('Plugins:', plugins);

  let maxHistoryLimit = 10; // 10 default

  // Todo - finish plugins implementation
  // also modify entire implementation to actually consider plugins, how?
  // a plugin provides a setter and getter function, so on channel when getState is called or setState, we instead call the ones of the plugin and what they return we merge it into the channel state and then return, channels can also call other exposed plugin method as channel.exposedPluginMethod(...args) etc!

  // add plugin to channel  active plugins and expose the plugin exposed methods on channel object

  // Todo - implement remove middleware

  const usePlugin = (channelName, pluginName) => {
    const plugin = plugins[pluginName] || null;

    if (plugin) {
      // Add the plugin to the channel's activePlugins
      channels[channelName].activePlugins.push(plugin);

      // Expose plugin methods on the channel object
      const exposedMethods = plugin.exposes || [];
      exposedMethods.forEach((item) => {
        channels[channelName][item.name] = (...args) =>
          item.method(channels[channelName].state, ...args);
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

  const getStateAuto = (channelName, options) => {
    if (options?.auto ?? true) {
      let stateGetterCallback = () => channels[channelName].state;
      // auto subscribe the state getter
      subscribe(channelName, stateGetterCallback);
    }
    return channels[channelName].state;
  };

  const getStateWithPlugins = (channelName, options) => {
    const channel = channels[channelName];
    let state = channel.state;

    for (const plugin of channel.activePlugins) {
      if (plugin.getter) {
        const pluginState = plugin.getter.method(state, plugin.getter.options);
        state = { ...state, ...pluginState };
      }
    }

    return getStateAuto(channelName, options);
  };

  const setStateWithPlugins = (channelName, newState) => {
    const channel = channels[channelName];
    let currentState = getState(channelName);
    let updatedState = newState;
    if (typeof newState === 'function') {
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
    channels[channelName].subscribers.forEach((subscriber) =>
      subscriber(channels[channelName].state)
    );
  };

  const unSubscribe = (channelName, fn) => {
    channels[channelName].subscribers.delete(fn);
  };

  const addChannel = (channelName, initialState = {}) => {
    channels[channelName] = {
      name: channelName,
      activePlugins: [],
      subscribers: new Set(),
      state: initialState,
      middleWares: [],
      history: [],
      setState: (newState) => setStateWithPlugins(channelName, newState),
      setStateAsync: (newState) => setStateAsync(channelName, newState),
      getState: (options) => getStateWithPlugins(channelName, options),
      getHistory: () => getHistory(channelName),
      addMiddleWares: (...callbackFns) =>
        addMiddleWares(channelName, ...callbackFns),
      subscribe: (callbackFn) => subscribe(channelName, callbackFn),
      unSubscribe: (callbackFn) => unSubscribe(channelName, callbackFn),
      notifySubscribers: (channelName) => notifySubscribers(channelName),
      usePlugin: (pluginName) => usePlugin(channelName, pluginName),
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
      const updatedChannels = Object.keys(channels)
        .filter((key) => key !== channelName)
        .reduce((obj, key) => {
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
    if (typeof newState === 'function') {
      _newState = newState(currentState);
    }
    return setState(channelName, _newState);
  };

  const setState = (channelName, newState) => {
    let previousState = channels[channelName].state;

    channels[channelName].state = newState;

    // log previous state to history, first flash it out if limit reached
    if (channels[channelName].history.length <= maxHistoryLimit) {
      channels[channelName].history.push(previousState);
    } else {
      channels[channelName].history = [];
      channels[channelName].history.push(previousState);
    }

    // notify all listeners of the new changes
    notifySubscribers(channelName);

    return channels[channelName].state;
  };

  const getChannels = () => channels;

  const setStateAsync = async (channelName, newState) => {
    const channel = channels[channelName];

    // Compose async middleware functions chain for this channel
    const composedAsyncChain = composeAsync(channel.middleWares, channelName);

    // get actual state in case it's a function
    let currentState = getState(channelName);
    let _newState = newState;
    if (typeof newState === 'function') {
      _newState = newState(currentState);
    }

    try {
      // Apply the composed async middleware chain to update state
      const newStateAfterMiddlewares = await composedAsyncChain(_newState);

      // Finally commit the updated state
      return setState(channelName, newStateAfterMiddlewares);
    } catch (error) {
      console.error('State update error, something happened:', error);
    }
  };

  const composeAsync = (functionsArray, channelName) =>
    functionsArray.reduce(
      (currentFn, nextFn, index) =>
        async (state, ...args) => {
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
      removeChannel,
    },
  };
}
