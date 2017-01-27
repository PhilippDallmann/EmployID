let Reflux = require("reflux");

let HomeActions = Reflux.createActions([
    "openCreateMeeting",
    "openEditMeeting",
    "openCreateGroup",
    "openEditGroup",
    "createGroup",
    "editGroup",
    "setUserArray"
]);

export default HomeActions;
