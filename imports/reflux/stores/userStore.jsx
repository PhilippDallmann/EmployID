/* global FlowRouter, Accounts */

import { Meteor } from 'meteor/meteor';

import UserActions from '../actions/userActions';
import DefaultModalActions from '../../reflux/actions/defaultModalActions';
import LoadingActions from '../../reflux/actions/loadingActions';

const Reflux = require('reflux');

const UserStore = Reflux.createStore({
  listenables: [UserActions],
  onLogin(userEmail, userPassword) {
    LoadingActions.setLoading();
    Meteor.loginWithPassword(userEmail, userPassword, (err) => {
      LoadingActions.unsetLoading();
      if (err) {
        DefaultModalActions.showError(err);
      } else { FlowRouter.go('home'); }
    });
  },
  onLogout() {
    LoadingActions.setLoading();
    Meteor.logout((err) => {
      LoadingActions.unsetLoading();
      if (err) {
        DefaultModalActions.showError(err);
      } else {
        FlowRouter.go('login');
      }
    });
  },
  onRegister(username, userEmail, userPassword) {
    LoadingActions.setLoading();
    Accounts.createUser({
      email: userEmail,
      password: userPassword,
      username,
    }, (err) => {
      LoadingActions.unsetLoading();
      if (err) {
        DefaultModalActions.showError(err);
      } else { FlowRouter.go('home'); }
    });
  },
  // #hack save activeMeetingId in profile (got an acces denied when use extra field directly in user)
  onSetActiveMeeting(meetingId) {
    Meteor.users.update({ _id: Meteor.user()._id }, { $set: { 'profile.activeMeetingId': meetingId } });
  },
  // #hack save activeMeetingId in profile (got an acces denied when use extra field directly in user)
  onUnsetActiveMeeting() {
    Meteor.users.update({ _id: Meteor.user()._id }, { $set: { 'profile.activeMeetingId': null } });
  },
});

module.exports = UserStore;
