import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';

import ChatActions from "../../../../../reflux/actions/chatActions";
import ChatStore from "../../../../../reflux/stores/chatStore";

import UserIcon from "./userIcon";

let Reflux = require("reflux");

class ChatUserBar extends Reflux.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.store = ChatStore;
  }
  render() {
    return(
      <div id="chatUserBar">
        {this.props.participants.map((user, index) => {
          var userStatus;
          var pulse='no-pulse';
          if($.inArray(user.username, this.state.typingUserArray)>-1) {
              userStatus = 'typing';
              pulse = 'pulse-ring';
          } else if (user && user.profile && user.profile.activeMeetingId == this.props.currentMeetingId) {
            userStatus = 'online';
          } else {
            userStatus = 'offline';
          }

          return(
              <UserIcon key={user._id} ref={user.username} user={user} spanText={user.username} status={userStatus} pulse={pulse}/>
          );
        })}
      </div>
    );
  }
}

ChatUserBar.propTypes = {
  participants: PropTypes.array.isRequired
};

export default createContainer(() => {
  return({
    participants: Meteor.users.find().fetch()
  });
},ChatUserBar);