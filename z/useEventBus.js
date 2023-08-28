export function useEventBus(ZParent, store) {
  // auto create custom events function for all initialState keys
  // subscribe all of them to the specified store state change
  // follow the onStateNameChanged convention to name the events
  // add in some optimizations like removing event listeners when element is removed or leaves the viewport
  // dispatch an event every time a state changes by subscribing  that specific event dispatching function with subscribe method

  // define event-store object to store all events
  let eventsStore = {};

  // auto create events for each initialState state item by default
  const autoGenerateInitialStateEvents = () => {
    const stateKeyEventNamePairs = generateEventNames(store);
    stateKeyEventNamePairs.forEach((pair) => {
      eventsStore[pair.stateKey] = new Event(pair.eventName);
    });
  };

  // define event dispatching method
  const eventDispatcher = (newState) => {
    Object.keys(newState).forEach((stateKey) => {
      ZParent.dispatchEvent(eventsStore[stateKey]);
      // todo: remove this log after debugging events
      console.log('event triggered:', eventsStore[stateKey]);
    });
  };

  // deifne event creation method
  const eventCreator = (stateKeyEventNamePair) => {
    eventsStore[pair.stateKey] = new Event(pair.eventName);
  };

  // define helper function to generate event names from state object
  const generateEventNames = (stateObject) => {
    let stateKeys = Object.keys(stateObject);
    let eventNamesArray = stateKeys.map((key) => {
      if (key.startsWith('$')) {
        let newKey = key.split('$')[1];
        let newKeyFinal = newKey.charAt(0).toUpperCase() + newKey.slice(1);
        let eventName = `on${newKeyFinal}Changed`;
        return { stateKey: key, eventName: eventName };
      } else {
        let newKey = key.charAt(0).toUpperCase() + key.slice(1);
        let eventName = `on${newKey}Changed`;
        return { stateKey: key, eventName: eventName };
      }
    });
    return eventNamesArray;
  };

  // auto gen initialState events
  autoGenerateInitialStateEvents();

  // auto subscribe events to state changes
  const eventSubscriptionHandler = (newState) => eventDispatcher(newState);

  // use event bus function exports
  return {
    eventsStore,
    eventCreator,
    eventDispatcher,
    eventSubscriptionHandler,
  };
}
