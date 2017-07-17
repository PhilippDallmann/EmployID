import {Meteor} from 'meteor/meteor';

import ResultCollection from '../results/results';

if(Meteor.isServer) {
  Meteor.methods({
    /**
     * updates the result
     * @param {string} resultId - ID of the result to be updated
     * @param {string} value - value of the new result field
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