import {Meteor} from 'meteor/meteor';
import StageCollection from './stages';
import MaterialCollection from '../materials/materials';

Meteor.methods({
  /**
   * adds a new material for a specific stage and role
   * @param  {string} stageID - id of the stage
   * @param {object} material -  contains all information about the new material (text, role, position, languageKey, isHeading)
   * */
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
  /**
   * deletes a material
   * @param {string} stageId - ID of the stage
   * @param {string} materialID - ID of the material to be deleted
   * */
  "deleteMaterial": function(stageId, materialId) {
    StageCollection.update({stage_id: stageId},{
      $pull: {material: materialId}
    });
    MaterialCollection.remove({_id: materialId});
  }
});
