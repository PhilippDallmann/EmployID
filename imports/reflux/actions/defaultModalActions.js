let Reflux = require("reflux");

let DefaultModalActions = Reflux.createActions([
    "showError",
    "showInfo",
    "showWarning"
]);

module.exports = DefaultModalActions;
