import { Meteor } from 'meteor/meteor';
import StageMessagesCollection from '../../stageMessages/stageMessages';

if (Meteor.isServer) {
  Meteor.publish('stageMessages', function () {
    var result = StageMessagesCollection.find();
    return result;
  });
}