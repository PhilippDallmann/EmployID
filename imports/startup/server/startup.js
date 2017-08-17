import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TAPi18n } from 'meteor/tap:i18n';

import StageCollection from '../../api/stages/stages';
import StageMessagesCollection from '../../api/stageMessages/stageMessages';

const desc = ['start', 'problem', 'vision', 'resources', 'setting goals', 'solution', 'feedback'];
const time = [0, 300, 600, 600, 300, 600, 300];

if (Meteor.isServer) {
  Meteor.startup(() => {
    global.AdminConfig = {
      collections: {},
    };
    if (StageCollection.find().count() === 0) {
      for (let i = 0; i < 7; i += 1) {
        StageCollection.insert({
          stage_id: i,
          description: desc[i],
          material: [],
          duration: time[i] });
      }
    }
    if (StageMessagesCollection.find().count() === 0) {
      // get all available languages
      const langObject = TAPi18n.getLanguages();
      const languages = [];
      Object.keys(langObject).forEach((key) => {
        languages.push(key);
      });
      for (let i = 0; i < languages.length; i += 1) {
        for (let stage = 0; stage < 7; stage += 1) {
          const message = TAPi18n.__(`stateMessages.${stage}`, null, languages[i]);
          StageMessagesCollection.insert({
            language_key: languages[i],
            stage,
            message,
          });
        }
      }
    }
  });
  Accounts.onCreateUser((options, u) => {
    const user = u;
    if (!Meteor.users.find().count()) {
      user.roles = ['user', 'admin'];
      user.profile = options.profile ? options.profile : {};
    } else {
      user.roles = ['user'];
      user.profile = options.profile ? options.profile : {};
    }
    return user;
  });
}
