import {Meteor} from 'meteor/meteor';

import ResultCollection from '../results/results';

if(Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary updates the result
     * @isMethod true
     * @param {String} resultId - ID of the result to be updated
     * @param {String} value - Value of the new result field
     * */
    "updateResult": function(resultId, value) {
        ResultCollection.update(resultId, {
          $set: {
            text: value
          }
        });
    }
  });
}