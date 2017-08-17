const Reflux = require('reflux');

const EditorActions = Reflux.createActions([
  'addMaterial',
  'deleteMaterial',
  'editMaterials',
  'toggleHeading',
]);

module.exports = EditorActions;
