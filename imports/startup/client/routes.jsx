import {Meteor} from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import ReactDOM from 'react-dom'
import {mount} from 'react-mounter';


import App from '../../ui/App';

/*import NotFound from "./components/notFound";
import EditProfile from "./components/editProfile/editProfile";
import Topic from "./components/topic/topic";
import Users from "./components/users/users";
import UserProfile from "./components/users/userProfile";
import Editor from "./components/editor/editor";*/
import Header from '../../ui/components/header/header';
import Login from '../../ui/components/login/login';
import Home from '../../ui/components/home/home';


import LoadingActions from '../../reflux/actions/loadingActions';
import LoadingStore from '../../reflux/stores/loadingStore';

const authenticatedRedirect = () => {
  if(!Meteor.loggingIn() && !Meteor.userId()) {
    FlowRouter.go("login");
  }
}

const publicRedirect = () => {
  if ( Meteor.userId() ) {
    FlowRouter.go("home");
  }
}

function checkIfSubsAreReady (subs, subsReady) {
  if(subsReady === subs) {
    LoadingActions.unsetLoading();
  }
}

/*FlowRouter.notFound = {
  action(params) {
    ReactLayout.render(App, {
      children: [<Header />, <NotFound />]
    });
  }
}*/

var exposed = FlowRouter.group({
    name: "public",
    triggersEnter: [publicRedirect]
  }
);

exposed.route('/login', {
  name: "login",
  action: function() {
    const containerElement = document.getElementById("render-target");
    mount(App, {children: <Login />});
  }
});

var loggedIn = FlowRouter.group({
    name: "authenticated",
    triggersEnter: [authenticatedRedirect]
  }
);

FlowRouter.route("/", {
  name: "landing",
  action: function() {
    FlowRouter.go("home");
  }
});

loggedIn.route('/home', {
  name: "home",
  subscriptions: function(params) {
    LoadingActions.setLoading();
    var subsReady = 0;
    var subs = 3;
    this.register("userSpecificMeetings", Meteor.subscribe("userSpecificMeetings", Meteor.userId(), {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("groupsOfCurrentUser", Meteor.subscribe("groupsOfCurrentUser", {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("notificationsOfCurrentUser", Meteor.subscribe("notificationsOfCurrentUser", Meteor.userId(),{
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
  },
  action: function() {
    mount(App, {
      children: [<Header />, <Home />]
    });
  }
});
/*
loggedIn.route('/editProfile', {
  name: "editProfile",
  action: function() {
    ReactLayout.render(App, {
      children: [<Header />, <EditProfile />]
    });
  }
});

loggedIn.route("/meeting/:meetingId", {
  name: "topic",
  subscriptions: function(params) {
    LoadingActions.setLoading();
    var subsReady = 0;
    var subs = 5;
    this.register("currentMeeting", Meteor.subscribe("currentMeeting", params.meetingId, {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("meetingParticipants", Meteor.subscribe("meetingParticipants", params.meetingId, {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("currentChatMessages", Meteor.subscribe("currentChatMessages", params.meetingId, {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("stages", Meteor.subscribe("stages", {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("stageMessages", Meteor.subscribe("stageMessages", {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
  },
  action: function() {
    ReactLayout.render(App, {
      children: [<Header />, <Topic />]
    });
  }
});

loggedIn.route('/users', {
  name: "users",
  action: function() {
    UserActions.findAllUsers();
    ReactLayout.render(App, {
      children: [<Header />, <Users />]
    });
  }
});

loggedIn.route('/users/:username', {
  name: "userProfile",
  action: function(params) {
    UserActions.findUserByUsername(params.username);
    ReactLayout.render(App, {
      children: [<Header />, <UserProfile />]
    });
  }
});

loggedIn.route("/editor", {
  name: "editor",
  subscriptions: function(params) {
    LoadingActions.setLoading();
    var subsReady = 0;
    var subs = 2;
    this.register("stages", Meteor.subscribe("stages", {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
    this.register("stageMessages", Meteor.subscribe("stageMessages", {
      onReady: function() {
        subsReady = subsReady + 1;
        checkIfSubsAreReady(subs, subsReady);
      }
    }));
  },
  action: function() {
    ReactLayout.render(App, {
      children: [<Header />, <Editor />]
    })
  }
});*/