const Reflux = require('reflux');

const DefaultModalActions = Reflux.createActions([
  'showError',
  'showInfo',
  'showWarning',
]);

module.exports = DefaultModalActions;
