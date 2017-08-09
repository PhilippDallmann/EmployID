import {Meteor} from 'meteor/meteor'

import UserActions from "../actions/userActions";
import DefaultModalActions from "../../reflux/actions/defaultModalActions";
import LoadingActions from "../../reflux/actions/loadingActions";

let Reflux = require("reflux");

let UserStore = Reflux.createStore({
    listenables: [UserActions],
    onLogin: function(userEmail, userPassword) {
        LoadingActions.setLoading();
        Meteor.loginWithPassword(userEmail, userPassword, function(err) {
              LoadingActions.unsetLoading();
              if(err){
                  DefaultModalActions.showError(err);
              }
              else {FlowRouter.go("home");}
        });
    },
    onLogout: function() {
        LoadingActions.setLoading();
        Meteor.logout(function(err){
            LoadingActions.unsetLoading();
            if(err){
                DefaultModalActions.showError(err);
            }
            else {
                FlowRouter.go("login");
            }
        });
    },
    onRegister: function(username, userEmail, userPassword) {
        LoadingActions.setLoading();
        Accounts.createUser({
            email: userEmail,
            password: userPassword,
            username: username
        }, function (err) {
            LoadingActions.unsetLoading();
            if(err){
                DefaultModalActions.showError(err);
            }
            else {FlowRouter.go("home");}
        });
    },
    // #hack save activeMeetingId in profile (got an acces denied when use extra field directly in user)
    onSetActiveMeeting: function(meetingId) {
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.activeMeetingId": meetingId}});
    },
    // #hack save activeMeetingId in profile (got an acces denied when use extra field directly in user)
    onUnsetActiveMeeting: function() {
      Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.activeMeetingId": null}});
    }
});

module.exports = UserStore;
