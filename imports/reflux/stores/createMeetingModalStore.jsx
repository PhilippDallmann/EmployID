import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");

import CreateMeetingModalActions from "../actions/createMeetingModalActions";

let CreateMeetingModalStore = Reflux.createStore({
    listenables: [CreateMeetingModalActions],
    onCreateMeeting: function(meeting) {
        Meteor.call("createMeeting", meeting);
    },
    onEditMeeting: function(meeting) {
      Meteor.call("editMeeting", meeting);
    }
});

export default CreateMeetingModalStore;
