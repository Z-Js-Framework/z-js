export interface Plugin {
  name?: string;
  getter?: {
    method: (state: any, options?: any) => any;
    options?: any;
  };
  setter?: {
    method: (state: any, options?: any) => any;
    options?: any;
  };
  exposes?: Array<{
    name: string;
    method: (state: any, ...args: any[]) => any;
  }>;
}

export interface StateRadioOptions {
  plugins?: Plugin[];
}

export interface Channel {
  name: string;
  activePlugins: Plugin[];
  subscribers: Set<(state: any) => void>;
  state: any;
  middleWares: Array<(state: any, ...args: any[]) => Promise<any>>;
  history: any[];
  setState: (newState: any | ((state: any) => any)) => any;
  setStateAsync: (newState: any | ((state: any) => any)) => Promise<any>;
  getState: (options?: { auto?: boolean }) => any;
  getHistory: () => any[];
  addMiddleWares: (
    ...callbackFns: Array<(state: any, ...args: any[]) => Promise<any>>
  ) => Array<(state: any, ...args: any[]) => Promise<any>>;
  subscribe: (callbackFn: (state: any) => void) => void;
  unSubscribe: (callbackFn: (state: any) => void) => void;
  notifySubscribers: () => void;
  usePlugin: (pluginName: string) => void;
}

export interface StateRadioInstance {
  channels: {
    getChannels: () => { [key: string]: Channel };
    getChannel: (channelName: string) => Channel | null;
    addChannel: (channelName: string, initialState?: any) => Channel;
    removeChannel: (
      channelName: string
    ) => { [key: string]: Channel } | undefined;
  };
}

export function StateRadio(options?: StateRadioOptions): StateRadioInstance;
