export function StateRadio(options?: {}): {
    channels: {
        getChannels: () => any[];
        getChannel: (channelName: any) => any;
        addChannel: (channelName: any, initialState?: {}) => any;
        removeChannel: (channelName: any) => any[];
    };
};
