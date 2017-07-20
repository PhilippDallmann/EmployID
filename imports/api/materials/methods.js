import {Meteor} from 'meteor/meteor';
import MaterialCollection from './materials';

Meteor.methods({
  /**
   * @summary Saves changes made to materials
   * @isMethod true
   * @param {Array} materials - list of materials that have been edited
   * @locus Method
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
   * @summary Toggle the heading-status of a material
   * @isMethod true
   * @param {String} materialId - ID of the material that has changed
   * @locus Method
   * */
  "toggleHeading": function(materialId) {
    var mat = MaterialCollection.findOne(materialId, {fields: {is_heading: 1}});
    MaterialCollection.update({_id: materialId}, {$set: {is_heading: !mat.is_heading}});
  }
});
