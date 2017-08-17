const Reflux = require('reflux');

const LoadingActions = Reflux.createActions([
  'setLoading',
  'unsetLoading',
]);

export default LoadingActions;
