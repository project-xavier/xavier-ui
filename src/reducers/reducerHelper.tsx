export const defaultIntialState = {
    loading: false,
    error: null
};

export const initialStateFor = (reducerName: string, initialObject: any = []) => {
    const initState: any = Object.assign({}, defaultIntialState);
    initState[reducerName] = initialObject;
    return initState;
};

export const successMessage = (base: string) => {
    return base + '_FULFILLED';
};

export const pendingMessage = (base: string) => {
    return base + '_PENDING';
};

export const failureMessage = (base: string) => {
    return base + '_REJECTED';
};
