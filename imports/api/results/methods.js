import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import ResultCollection from '../results/results';

if (Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary updates the result
     * @isMethod true
     * @param {String} resultId - ID of the result to be updated
     * @param {String} value - Value of the new result field
     * @locus Method
     * */
    updateResultText(resultId, value) {
      check(resultId, String);
      check(value, String);
      ResultCollection.update(resultId, {
        $set: {
          text: value,
        },
      });
    },
    /**
     * @summary Update specific fields of a result
     * @isMethod true
     * @param {String} resultId - ID of the result
     * @param {Array} fieldValueArray - contains the fields to be changed and the corresponding values
     * @locus Method
     * */
    updateResult(resultId, fieldValueArray) {
      check(resultId, String);
      check(fieldValueArray, Array);
      const updateQuery = {};
      for (const f in fieldValueArray) {
        updateQuery[fieldValueArray[f][0]] = fieldValueArray[f][1];
      }

      ResultCollection.update(resultId,
        { $set: updateQuery },
      );
    },
  });
}
