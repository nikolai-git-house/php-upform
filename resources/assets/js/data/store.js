const INITIAL_STATE = {
    answers: [],
    questions: [],
};

let listeners = [];
let state = INITIAL_STATE;

const broadcastChangesToListeners = () => {
    listeners.forEach((listener) => {
        listener(state);
    });
};

export const setState = (newState) => {
    state = Object.assign({}, state, newState);
    broadcastChangesToListeners();
};

export const getState = () => {
    return state;
};

export const addListener = (listener) => {
    listeners = [...listeners, listener];
    return listeners.length - 1;
}

export const removeListener = (listenerIndex) => {
    listeners = [...listeners.splice(0, listenerIndex), ...listeners.splice(listenerIndex + 1)]
}