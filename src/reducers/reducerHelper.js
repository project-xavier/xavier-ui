export const defaultIntialState = {
    loading: false,
    error: null
};

export const initialStateFor = function (reducerName, initialObject = []) {
    let initState = Object.assign({}, defaultIntialState);
    initState[reducerName] = initialObject;
    return initState;
};

export const successMessage = (base) => {
    return base + '_FULFILLED';
};

export const pendingMessage = (base) => {
    return base + '_PENDING';
};

export const failureMessage = (base) => {
    return base + '_REJECTED';
};
