export function Router(config?: {}): {
    history: History;
    location: Location;
    goTo: (urlPath: any, options?: {}) => void;
    goBack: () => void;
    goForward: () => void;
    getParam: (param: any) => string;
    reloadRouter: () => void;
};
