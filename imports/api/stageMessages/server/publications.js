import { Meteor } from 'meteor/meteor';
import StageMessagesCollection from '../../stageMessages/stageMessages';

if (Meteor.isServer) {
  Meteor.publish('stageMessages', function () {
    return StageMessagesCollection.find();
  });
}