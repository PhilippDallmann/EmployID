let Reflux = require("reflux");

let LoadingActions = Reflux.createActions([
    "setLoading",
    "unsetLoading"
]);

export default LoadingActions;
