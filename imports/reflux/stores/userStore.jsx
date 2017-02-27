import {Meteor} from 'meteor/meteor'

import UserActions from "../actions/userActions";

import DefaultModalActions from "../../reflux/actions/defaultModalActions";
import DefaultModalStore from "../../reflux/stores/defaultModalStore";

import LoadingActions from "../../reflux/actions/loadingActions";
import LoadingStore from "../../reflux/stores/loadingStore";

//import defaultUserImage from '../../components/assets/img/defaultUserImage_140x140.png';
var defaultUserImage = '/img/defaultUserImage_140x140.png';

let Reflux = require("reflux");

let UserStore = Reflux.createStore({
    listenables: [UserActions],
    state: {
        editProfile: {
          currentAvatar: defaultUserImage,
          userImageUploadButtonDisabled: true
        },
        userProfile: {
            username: null,
            email: null,
            avatar: null,
            firstName: null,
            lastName: null
        },
        userList: null
    },
    init: function() {
        var me = this;

        if (!Meteor.user()) {
          Accounts.onLogin(function() {
              me.state.editProfile.currentAvatar = (Meteor.user().profile && Meteor.user().profile.avatar) ? Meteor.user().profile.avatar : defaultUserImage;
          });
        } else if (Meteor.user().profile && Meteor.user().profile.avatar) {
            this.state.editProfile.currentAvatar = Meteor.user().profile.avatar;
        }
    },
    getInitialState: function() {
        return this.state;
    },
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
    onUpdateUser: function(userFirstName, userLastName) {
        LoadingActions.setLoading();
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.firstName": userFirstName, "profile.lastName": userLastName}}, function(error){
          LoadingActions.unsetLoading();
          if (error) {
              DefaultModalActions.showError(error);
          }
        });
    },
    onUpdateUserImage: function() {
        var me = this;

        var file = document.getElementById('userImageFileInput').files[0];
        this.readImage(file, function(error, file) {
            if (!error) {
                me.state.editProfile.currentAvatar = file.result;
                me.state.editProfile.userImageUploadButtonDisabled = false;

                me.trigger(me.state);
            } else {
                me.state.editProfile.userImageUploadButtonDisabled = true;
                me.trigger(me.state);

                DefaultModalActions.showError(error);
            }
        })
    },
    onUploadUserImage: function() {
        var me = this;

        LoadingActions.setLoading();
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.avatar": me.state.editProfile.currentAvatar}}, function(error) {
            LoadingActions.unsetLoading();
            if (error) {
                DefaultModalActions.showError(error);
            }
        });

        me.state.editProfile.userImageUploadButtonDisabled = true;
        me.trigger(me.state);
    },
    readImage: function(file, callback) {
        var FILEUPLOAD = {
            IMG : {  TYPE: ["image/jpeg", "image/png"], MAXSIZE: 3072000  },// 3072 kb
        };

        var reader = new FileReader();
        reader.onload = function (e) {
            // check file
            if(!_.contains(FILEUPLOAD.IMG.TYPE, file.type)){
                callback(new Meteor.Error(412, "File format not supported. Please upload .jpg or .png"));
                return;
            }
            // check size
            if(file.size > FILEUPLOAD.IMG.MAXSIZE){
                callback(new Meteor.Error(412, "File is too large. 512kb size limit"));
                return;
            }
            file.result = e.target.result;
            callback(null, file);
        };
        reader.onerror = function () {
            callback(reader.error);
        };
        reader.readAsDataURL(file);
    },
    onFindUserByUsername: function(username) {
        var me = this;
        Meteor.subscribe("usersWithFullProfile", {
            onReady: function () {
              var user = Meteor.users.findOne({ "username" : username });

              if (user) {
                  me.state.userProfile = {
                        username: user.username,
                        email: user.emails[0].address,
                        avatar: (user.profile && user.profile.avatar) ? user.profile.avatar : defaultUserImage,
                        firstName: user.profile && user.profile.firstName,
                        lastName: user.profile && user.profile.lastName
                  };
                  me.trigger(me.state);
              } else {
                var error = new Meteor.Error(403, "User not found");
                DefaultModalActions.showError(error);

                FlowRouter.go("users");
              }
            }
        });
    },
    onFindAllUsers: function() {
      var me = this;
      Meteor.subscribe("usersWithIdUsername", {
          onReady: function () {
            me.state.userList = Meteor.users.find().fetch();
            me.trigger(me.state);
          }
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
