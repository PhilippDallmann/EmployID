import {Meteor} from 'meteor/meteor';
import MaterialCollection from './materials';

Meteor.methods({
  "editMaterials": function(materials) {
    console.log(materials);
    for(var i=0; i<materials.length;i++) {
      var m = materials[i];
      console.log(m);
      MaterialCollection.update({_id: m.id}, {$set: {text: m.text}});
    }
  },
  "toggleHeading": function(materialId) {
    var mat = MaterialCollection.findOne(materialId, {fields: {is_heading: 1}});
    MaterialCollection.update({_id: materialId}, {$set: {is_heading: !mat.is_heading}});
  }
});
