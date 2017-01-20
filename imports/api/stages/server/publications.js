import { Meteor } from 'meteor/meteor';
import StageCollection from '../stages';

if (Meteor.isServer) {
  Meteor.publish('stages', function () {
    var result = StageCollection.find();
    return result;
  });
}