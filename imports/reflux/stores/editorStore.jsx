import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");

import EditorActions from "../actions/editorActions";

let EditorStore = Reflux.createStore({
    listenables: [EditorActions],
    onAddMaterial: function(stageId, material) {
        Meteor.call("addMaterial", stageId, material);
    },
    onDeleteMaterial: function(stageId, materialId) {
      Meteor.call("deleteMaterial", stageId, materialId);
    },
    onEditMaterials: function(materials) {
      Meteor.call("editMaterials", materials);
    },
    onToggleHeading: function(materialId) {
      Meteor.call("toggleHeading", materialId);
    }
});

export default EditorStore;
