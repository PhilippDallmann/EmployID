import {Meteor} from 'meteor/meteor';
import StageCollection from './stages';
import MaterialCollection from '../materials/materials';

Meteor.methods({
  "addMaterial": function(stageId, material) {
    var newMaterial = MaterialCollection.insert({
      text: material.text,
      role: material.role,
      position: material.position,
      language_key: material.languageKey,
      is_heading: material.isHeading
    });

    StageCollection.update({stage_id: stageId}, {
      $addToSet: {material: newMaterial}
    });
  },
  "deleteMaterial": function(stageId, materialId) {
    StageCollection.update({stage_id: stageId},{
      $pull: {material: materialId}
    });
    MaterialCollection.remove({_id: materialId});
  }
});
