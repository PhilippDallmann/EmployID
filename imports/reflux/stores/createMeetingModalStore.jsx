import {Meteor} from 'meteor/meteor';
import {TAPi18n} from 'meteor/tap:i18n';

let Reflux = require("reflux");

import CreateMeetingModalActions from "../actions/createMeetingModalActions";

let CreateMeetingModalStore = Reflux.createStore({
    listenables: [CreateMeetingModalActions],
    onCreateMeeting: function(meeting) {
        Meteor.call("createMeeting", meeting, TAPi18n.getLanguage());
    },
    onEditMeeting: function(meeting) {
      Meteor.call("editMeeting", meeting);
    }
});

export default CreateMeetingModalStore;
