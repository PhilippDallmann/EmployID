import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MaterialCollection from './materials';

Meteor.methods({
  /**
   * @summary Saves changes made to materials
   * @isMethod true
   * @param {Array} materials - list of materials that have been edited
   * @locus Method
   * */
  editMaterials(materials) {
    check(materials, Array);
    for (let i = 0; i < materials.length; i += 1) {
      const m = materials[i];
      MaterialCollection.update({ _id: m.id }, { $set: { text: m.text } });
    }
  },
  /**
   * @summary Toggle the heading-status of a material
   * @isMethod true
   * @param {String} materialId - ID of the material that has changed
   * @locus Method
   * */
  toggleHeading(materialId) {
    check(materialId, String);
    const mat = MaterialCollection.findOne(materialId, { fields: { is_heading: 1 } });
    MaterialCollection.update({ _id: materialId }, { $set: { is_heading: !mat.is_heading } });
  },
});
