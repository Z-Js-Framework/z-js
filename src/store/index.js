import { generateUniqueId } from '../utils/utilities.js';
import { StateRadio } from './state-radio/lib/state-radio.js';

// state management
const { channels } = new StateRadio();

export const store = channels;

export function useEffect(newFn, dependentStateChannels) {
  if (dependentStateChannels.length === 0) {
    window.addEventListener('DOMContentLoaded', newFn());
    return;
  }
  dependentStateChannels.forEach((channel) => {
    // console.log('log::', channel);
    let targetChannel = store.getChannel(channel.id);
    if (!targetChannel) {
      console.error('channel not found', channel);
      return;
    }
    targetChannel.subscribe(newFn);
  });
}

export function useState(initialState) {
  let newStateId = generateUniqueId('state', 12);

  let channel = channels.addChannel(newStateId, initialState);

  const state = {
    id: newStateId,
    current: () => channel.getState(),
    value: channel.getState(),
  };
  // const state = channel.getState();
  const setState = channel.setState;

  return [state, setState, channel];
}
