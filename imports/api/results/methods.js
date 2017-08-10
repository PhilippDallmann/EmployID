import {Meteor} from 'meteor/meteor';

import ResultCollection from '../results/results';

if(Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary updates the result
     * @isMethod true
     * @param {String} resultId - ID of the result to be updated
     * @param {String} value - Value of the new result field
     * @locus Method
     * */
    "updateResultText": function(resultId, value) {
        ResultCollection.update(resultId, {
          $set: {
            text: value
          }
        });
    },
    /**
     * @summary Update specific fields of a result
     * @isMethod true
     * @param {String} userId - ID of the result
     * @param {Array} fieldValueArray - contains the fields to be changed and the corresponding values
     * @locus Method
     * */
    "updateResult": function(resultId, fieldValueArray) {
      var update_query = {};
      for (var f in fieldValueArray) {
        update_query[fieldValueArray[f][0]]= fieldValueArray[f][1];
      }

      ResultCollection.update(userId,
        {$set: update_query}
      );
    }
  });
}