/**
 * Subscribes a function or rather say runs an effect when the state of one or more dependent state channels changes.
 * @param {Function} newFn - The function to be called when the dependent state changes.
 * @param {Array} dependentStateChannels - An array of state channels that the function depends on. If this array is empty, the function will be called when the DOM content is loaded, once and only once for all component lifetime.
 */
export function useEffect(newFn: Function, dependentStateChannels: any[]): void;
/**
 * Creates a new state with a unique ID and a channel for managing its value.
 * @param {*} initialState - The initial value of the state.
 * @returns {Array} An array containing the state object, setState function, and the channel.
 */
export function useState(initialState: any): any[];
/**
 * Creates a new store with a unique ID and methods for managing its state.
 * @param {*} initialState - The initial state of the store.
 * @returns {Object} An object with methods to interact with the store.
 */
export function createStore(initialState: any): any;
/**
 * Creates a state object and setState function from an existing store.
 * @param {Object} store - The store object created by createStore.
 * @returns {Array} An array containing the state object that has same shape as that of useState, then setState function, and the store's channel.
 */
export function useStore(store: any): any[];
export const radio: {
    getChannels: () => any[];
    getChannel: (channelName: any) => any;
    addChannel: (channelName: any, initialState?: {}) => any;
    removeChannel: (channelName: any) => any[];
};
