export default store => next => (action) => {
  const {
    types,
    callAPI,
    shouldCallAPI = () => true,
    callbackSuccess,
    callbackFailure,
  } = action;

  if (!types) {
    return next(action);
  }

  if (
    !Array.isArray(types) ||
    types.length !== 3 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('Expected an array of three string types.');
  }

  if (typeof callAPI !== 'function') {
    throw new Error('Expected callAPI to be a function.');
  }

  if (!shouldCallAPI(store.getState())) {
    return false;
  }

  const [requestType, successType, failureType] = types;

  store.dispatch({ type: requestType });
  return callAPI()
    .then(response => response.json())
    .then((data) => {
      if (typeof callbackSuccess === 'function') {
        return callbackSuccess(data);
      }
      return store.dispatch({
        type: successType,
        data,
      });
    })
    .catch((error) => {
      if (typeof callbackFailure === 'function') {
        return callbackFailure(error);
      }
      return store.dispatch({
        type: failureType,
        error: error.message,
      });
    });
};
