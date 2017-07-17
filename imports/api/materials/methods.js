import {Meteor} from 'meteor/meteor';
import MaterialCollection from './materials';

Meteor.methods({
  /**
   * Saves changes made to materials
   * @param {array} materials - list of materials that have been edited
   * */
  "editMaterials": function(materials) {
    console.log(materials);
    for(var i=0; i<materials.length;i++) {
      var m = materials[i];
      console.log(m);
      MaterialCollection.update({_id: m.id}, {$set: {text: m.text}});
    }
  },
  /**
   * Toggle the heading-status of a material
   * @param {String} materialId - ID of the material that has changed
   * */
  "toggleHeading": function(materialId) {
    var mat = MaterialCollection.findOne(materialId, {fields: {is_heading: 1}});
    MaterialCollection.update({_id: materialId}, {$set: {is_heading: !mat.is_heading}});
  }
});
