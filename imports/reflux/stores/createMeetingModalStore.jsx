import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import CreateMeetingModalActions from '../actions/createMeetingModalActions';

const Reflux = require('reflux');

const CreateMeetingModalStore = Reflux.createStore({
  listenables: [CreateMeetingModalActions],
  onCreateMeeting(meeting) {
    Meteor.call('createMeeting', meeting, TAPi18n.getLanguage());
  },
  onEditMeeting(meeting) {
    Meteor.call('editMeeting', meeting);
  },
});

export default CreateMeetingModalStore;
