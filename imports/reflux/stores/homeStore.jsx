/* global document */

import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import CreateMeetingModal from '../../ui/components/modals/createMeetingModal.jsx';
import CreateGroupModal from '../../ui/components/modals/createGroupModal.jsx';
import HomeActions from '../actions/homeActions';

const Reflux = require('reflux');

const HomeStore = Reflux.createStore({
  listenables: [HomeActions],
  state: {
    modal: null,
  },
  onOpenCreateMeeting() {
    ReactDOM.unmountComponentAtNode(document.getElementById('createMeetingModal'));
    ReactDOM.render(<CreateMeetingModal meeting={null} />, document.getElementById('createMeetingModal'));
  },
  onOpenEditMeeting(meeting) {
    ReactDOM.unmountComponentAtNode(document.getElementById('createMeetingModal'));
    ReactDOM.render(<CreateMeetingModal meeting={meeting} />, document.getElementById('createMeetingModal'));
  },
  onOpenCreateGroup() {
    this.state.modal = ReactDOM.render(<CreateGroupModal group={null} />, document.getElementById('createGroupModal'));
    this.state.modal.open();
  },
  onOpenEditGroup(group) {
    this.state.modal = ReactDOM.render(<CreateGroupModal group={group} />, document.getElementById('createGroupModal'));
    this.state.modal.open();
  },
  onCreateGroup(g) {
    const me = this;
    const group = g;
    Meteor.call('validateUsernameList', group.users, (error, result) => {
      if (error) {
        swal(error.message);
      } else {
        group.users = result;
        Meteor.call('createGroup', group, TAPi18n.getLanguage(), (err) => {
          if (error) {
            swal(err.reason);
          } else {
            me.state.modal.close();
            me.state.modal = null;
          }
        });
      }
    });
  },
  onEditGroup(g) {
    const me = this;
    const group = g;
    Meteor.call('validateUsernameList', group.users, (error, result) => {
      if (error) {
        swal(error.details);
      } else {
        group.users = result;
        Meteor.call('editGroup', group, (err) => {
          if (err) {
            swal(err.reason);
          } else {
            me.state.modal.close();
            me.state.modal = null;
          }
        });
      }
    });
    Meteor.call('editGroup', group);
  },
});

export default HomeStore;
