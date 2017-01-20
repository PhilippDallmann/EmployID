import {Meteor} from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.users.find({ "status.online": true }).observe({
    // user goes online
    /*added: function(user) {
     console.log(user._id);
     },*/
    // user goes offline
    removed: function(user) {
      Meteor.users.update({_id: user._id}, {$set:{"profile.activeMeetingId": null}});
    }
  });
}
