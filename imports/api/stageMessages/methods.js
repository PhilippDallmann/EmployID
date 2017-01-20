import {Meteor} from 'meteor/meteor';
import StageMessagesCollection from './stageMessages';

Meteor.methods({
  "updateStageMessage": function(stage, languageKey, message) {
    StageMessagesCollection.update({stage: stage, language_key: languageKey}, {
      $set: {message: message}
    });
  }
});
