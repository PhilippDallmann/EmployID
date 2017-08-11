import {Meteor} from 'meteor/meteor';
import StageCollection from './stages';
import MaterialCollection from '../materials/materials';

Meteor.methods({
  /**
   * @summary adds a new material for a specific stage and role
   * @isMethod true
   * @param  {String} stageID - id of the stage
   * @param {Object} material -  contains all information about the new material (text, role, position, languageKey, isHeading)
   * @locus Method
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
  "addMaterialGivenStageDescription": function(stage, material) {
    var newMaterial = MaterialCollection.insert({
      text: material.text,
      role: material.role,
      position: material.position,
      language_key: material.languageKey,
      is_heading: material.isHeading
    });

    StageCollection.update({description: stage}, {
      $addToSet: {material: newMaterial}
    });
  },
  /**
   * @summary deletes a material
   * @isMethod true
   * @param {String} stageId - ID of the stage
   * @param {String} materialID - ID of the material to be deleted
   * @locus Method
   * */
  "deleteMaterial": function(stageId, materialId) {
    StageCollection.update({stage_id: stageId},{
      $pull: {material: materialId}
    });
    MaterialCollection.remove({_id: materialId});
  },
  "deleteAllMaterials": function() {
    StageCollection.update({}, {
      $set: {material: []},
    }, {
      multi: true
      }
    );
    MaterialCollection.remove({});
  }
});
