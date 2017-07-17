import {Meteor} from 'meteor/meteor';
import StageMessagesCollection from './stageMessages';

Meteor.methods({
  /**
   * updates a stagemessage
   * @param {number} stage - Number representation of the stage
   * @param {string} languageKey - represents the language of the message
   * @param {string} message - value of the message
   * */
  "updateStageMessage": function(stage, languageKey, message) {
    StageMessagesCollection.update({stage: stage, language_key: languageKey}, {
      $set: {message: message}
    });
  }
});
