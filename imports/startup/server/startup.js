import {Meteor} from 'meteor/meteor'
import StageCollection from '../../api/stages/stages';
import StageMessagesCollection from '../../api/stageMessages/stageMessages';

if (Meteor.isServer) {
  Meteor.startup(function () {
    global.AdminConfig = {
      collections: {}
    };
    if (StageCollection.find().count() === 0) {
      var desc = ['start', 'problem', 'vision', 'resources', 'setting goals', 'solution', 'feedback'];
      var time = [0, 300, 600, 600, 300, 600, 300];

      for (var i = 0;i < 7;i++) {
        StageCollection.insert({
          stage_id: i,
          description: desc[i],
          material: [],
          duration: time[i]});
      }
    }
    if(StageMessagesCollection.find().count() === 0) {

      // get all available languages
      var langObject = TAPi18n.getLanguages();
      var languages = [];
      for(var index in langObject) {
        languages.push(index);
      }

      for (var i = 0; i < languages.length; i++) {
        var keyOfLoadedFile = TAPi18n.__('languageKey', null, languages[i]);

        for (var stage = 0; stage < 7; stage++) {
          var message = TAPi18n.__("stateMessages." + stage, null, languages[i]);
          StageMessagesCollection.insert({
            language_key: languages[i],
            stage: stage,
            message: message
          });
        }
      }
    }
    if (!Meteor.users.find().count()) {
      var options = {
        username: "admin",
        password: "AdminPassword",
        email: "admin@admin.com"
      };
      var id = Accounts.createUser(options);
      Roles.addUsersToRoles(id, ["admin"]);
    }
  });
  Accounts.onCreateUser(function(options, user) {
    user.roles = [ "user" ];
    user.profile = options.profile ? options.profile : {};
  });
  Accounts.onLogin(function(user) {
    if(!user.user.profile||!user.user.profile.authorID||user.user.profile.authorID==null) {

    }
  });
}
