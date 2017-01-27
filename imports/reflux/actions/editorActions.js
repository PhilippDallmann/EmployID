let Reflux = require("reflux");

let EditorActions = Reflux.createActions([
    "addMaterial",
    "deleteMaterial",
    "editMaterials",
    "toggleHeading"
]);

module.exports = EditorActions;
