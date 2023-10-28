export function useEventBus(getStoreValue, setStore) {
  // define event-store object to store all events
  let eventsStore = {};

  // auto create events for each initialState state item by default
  const autoGenerateStateEvents = () => {
    let store = getStoreValue();
    const stateKeyEventNamePairs = generateEventNames(store);
    stateKeyEventNamePairs.forEach((pair) => {
      let newEvent = {
        eventName: pair.eventName,
        callbacks: [],
        data: store[pair.stateKey],
      };
      eventsStore[pair.stateKey] = newEvent;
    });

    // console.log('event store:', eventsStore);
  };

  const getEventData = (eventName) => {
    autoGenerateStateEvents();

    let target = Object.values(eventsStore).find(
      (e) => e.eventName === eventName
    );

    return target;
  };

  // define event listener callback registering function
  const addNewListener = (eventName, callbackFn) => {
    Object.keys(eventsStore).forEach((key) => {
      if (eventsStore[key].eventName === eventName) {
        eventsStore[key].callbacks.push(callbackFn);
      }
    });
    // console.log('Event Store:', eventsStore);
  };

  // define event dispatching method
  const eventDispatcher = (oldState, newState) => {
    // get mutated state's key
    let changedStateKey = compareStates(oldState, newState);

    Object.keys(newState).forEach((stateKey) => {
      if (oldState[stateKey] !== newState[stateKey]) {
        let eventKey = Object.keys(eventsStore).find(
          (event) => event === changedStateKey
        );
        // refresh the events store with new event data
        eventsStore[eventKey].data = newState[changedStateKey];
        // console.log('from event dispatch:', eventsStore);

        // notify all event listener callbacks
        eventsStore[eventKey].callbacks.forEach((callbackFn) => {
          // console.log('data to fn:', eventsStore[eventKey].data);
          callbackFn(eventsStore[eventKey].data);
        });
      }
    });
  };

  // simple comparison of the changes of the old state and the new state
  const compareStates = (oldState, newState) => {
    for (const key in newState) {
      if (oldState[key] !== newState[key]) {
        return key;
      }
    }
  };

  // deifne event creation method
  const eventCreator = (eventName, initialData) => {
    const newEvent = {
      eventName: eventName,
      callbacks: [],
      data: initialData,
    };
    eventsStore[eventName] = newEvent;

    // add and update store with new state for this event
    setStore((previousStoreValue) => ({
      ...previousStoreValue,
      [eventName]: newEvent,
    }));
  };

  // define helper function to generate event names from state object
  const generateEventNames = (stateObject) => {
    let stateKeys = Object.keys(stateObject);
    let eventNamesArray = stateKeys.map((key) => {
      if (key.startsWith('$')) {
        let newKey = key.split('$')[1];
        let newKeyFinal = newKey.charAt(0).toLowerCase() + newKey.slice(1);
        let eventName = `${newKeyFinal}Changed`;
        return { stateKey: key, eventName: eventName };
      } else {
        let newKey = key.charAt(0).toLowerCase() + key.slice(1);
        let eventName = `${newKey}Changed`;
        return { stateKey: key, eventName: eventName };
      }
    });
    return eventNamesArray;
  };

  // auto gen initialState events
  autoGenerateStateEvents();

  // auto subscribe events to state changes
  const eventSubscriptionHandler = (oldState, newState) =>
    eventDispatcher(oldState, newState);

  // use event bus function exports
  return {
    eventsStore,
    addNewListener,
    eventCreator,
    eventDispatcher,
    eventSubscriptionHandler,
  };
}
