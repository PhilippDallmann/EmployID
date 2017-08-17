import { Meteor } from 'meteor/meteor';
import EditorActions from '../actions/editorActions';

const Reflux = require('reflux');

const EditorStore = Reflux.createStore({
  listenables: [EditorActions],
  onAddMaterial(stageId, material) {
    Meteor.call('addMaterial', stageId, material);
  },
  onDeleteMaterial(stageId, materialId) {
    Meteor.call('deleteMaterial', stageId, materialId);
  },
  onEditMaterials(materials) {
    Meteor.call('editMaterials', materials);
  },
  onToggleHeading(materialId) {
    Meteor.call('toggleHeading', materialId);
  },
});

export default EditorStore;
