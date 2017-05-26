import {Meteor} from 'meteor/meteor';

import ResultCollection from '../results/results';

if(Meteor.isServer) {
  Meteor.methods({
    "updateResult": function(resultId, value) {
        ResultCollection.update(resultId, {
          $set: {
            text: value
          }
        });
    }
  });
}