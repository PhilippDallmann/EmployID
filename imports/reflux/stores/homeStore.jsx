import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");

import CreateMeetingModal from "../../ui/components/modals/createMeetingModal";
import CreateGroupModal from "../../ui/components/modals/createGroupModal";
import HomeActions from "../actions/homeActions";

let HomeStore = Reflux.createStore({
    listenables: [HomeActions],
    state: {
      modal: null
    },
    onOpenCreateMeeting: function() {
      this.state.modal = ReactDOM.render(<CreateMeetingModal meeting={null}/>, document.getElementById("createMeetingModal"));
      this.state.modal.open();
    },
    onOpenEditMeeting: function(meeting) {
        this.state.modal = ReactDOM.render(<CreateMeetingModal meeting={meeting}/>, document.getElementById("createMeetingModal"));
        this.state.modal.open();
    },
    onOpenCreateGroup: function() {
      this.state.modal = ReactDOM.render(<CreateGroupModal group={null}/>, document.getElementById("createGroupModal"));
      this.state.modal.open();
    },
    onOpenEditGroup: function(group) {
      this.state.modal = ReactDOM.render(<CreateGroupModal group={group}/>, document.getElementById("createGroupModal"));
      this.state.modal.open();
    },
    onCreateGroup: function(group) {
      let me = this;
      Meteor.call("validateUsernameList", group.users, function(error, result) {
        if(error) {
          swal(error.details);
        } else {
          group.users = result;
          Meteor.call("createGroup", group, TAPi18n.getLanguage(), function(error, result) {
            if(error) {
              console.debug(error);
              swal(error.reason);
            } else {
              me.state.modal.close();
              me.state.modal = null;
            }
          });
        }
      });
    },
    onEditGroup: function(group) {
      let me = this;
      Meteor.call("validateUsernameList", group.users, function(error, result) {
        if(error) {
          swal(error.details);
        } else {
          group.users = result;
          Meteor.call("editGroup", group, function(error, result) {
            if(error) {
              console.debug(error);
              swal(error.reason);
            } else {
              me.state.modal.close();
              me.state.modal = null;
            }
          });
        }
      });
      Meteor.call("editGroup", group);
    }
});

export default HomeStore;
