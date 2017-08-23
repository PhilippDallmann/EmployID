import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';
import { TAPi18n } from 'meteor/tap:i18n';
import swal from 'sweetalert2';


import App from '../../ui/App.jsx';
import Header from '../../ui/components/header/header.jsx';
import Login from '../../ui/components/login/login.jsx';
import Home from '../../ui/components/home/home.jsx';
import Meeting from '../../ui/components/meeting/meeting.jsx';
import Editor from '../../ui/components/editor/editor.jsx';
import Result from '../../ui/components/result/result.jsx';
import EditProfile from '../../ui/components/editProfile/editProfile.jsx';

import LoadingActions from '../../reflux/actions/loadingActions';

// import NotFound from "./components/notFound";
// import Users from "./components/users/users";
// import UserProfile from "./components/users/userProfile";

const authenticatedRedirect = () => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    FlowRouter.go('login');
  }
};

const publicRedirect = () => {
  if (Meteor.userId()) {
    FlowRouter.go('home');
  }
};

function checkIfSubsAreReady(subs, subsReady) {
  if (subsReady === subs) {
    // LoadingActions.unsetLoading();
  }
}

/* FlowRouter.notFound = {
  action(params) {
    ReactLayout.render(App, {
      children: [<Header />, <NotFound />]
    });
  }
} */

const exposed = FlowRouter.group({
  name: 'public',
  triggersEnter: [publicRedirect],
},
);

exposed.route('/login', {
  name: 'login',
  action() {
    mount(App, { children: <Login /> });
  },
});

const loggedIn = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [authenticatedRedirect],
},
);

FlowRouter.route('/', {
  name: 'landing',
  action() {
    FlowRouter.go('home');
  },
});

loggedIn.route('/home', {
  name: 'home',
  subscriptions() {
    // LoadingActions.setLoading();
    let subsReady = 0;
    const subs = 3;
    this.register('userSpecificMeetings', Meteor.subscribe('userSpecificMeetings', Meteor.userId(), {
      onReady() {
        subsReady += 1;
        checkIfSubsAreReady(subs, subsReady);
      },
    }));
    this.register('groupsOfCurrentUser', Meteor.subscribe('groupsOfCurrentUser', {
      onReady() {
        subsReady += 1;
        checkIfSubsAreReady(subs, subsReady);
      },
    }));
    this.register('notificationsOfCurrentUser', Meteor.subscribe('notificationsOfCurrentUser', Meteor.userId(), {
      onReady() {
        subsReady += 1;
        checkIfSubsAreReady(subs, subsReady);
      },
    }));
  },
  action(params, queryParams) {
    mount(App, {
      children: [<Header />, <Home />],
    });
    if (queryParams.meeting === 'expired') {
      swal({
        title: TAPi18n.__('defaultModal.warning'),
        text: TAPi18n.__('swal.meetingExpired'),
        type: 'warning',
      });
    }
    FlowRouter.setQueryParams({ meeting: null });
  },
});

loggedIn.route('/editProfile', {
  name: 'editProfile',
  action() {
    mount(App, {
      children: [<Header />, <EditProfile />],
    });
  },
});

loggedIn.route('/meeting/:meetingId', {
  name: 'meeting',
  action() {
    LoadingActions.setLoading();
    mount(App, {
      children: [<Header />, <Meeting />],
    });
  },
});

loggedIn.route('/result/:meetingId', {
  name: 'result',
  action() {
    LoadingActions.setLoading();
    mount(App, {
      children: [<Header />, <Result />],
    });
  },
});
/*
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
*/
loggedIn.route('/editor', {
  name: 'editor',
  subscriptions() {
    LoadingActions.setLoading();
    let subsReady = 0;
    const subs = 2;
    this.register('stages', Meteor.subscribe('stages', {
      onReady() {
        subsReady += 1;
        checkIfSubsAreReady(subs, subsReady);
      },
    }));
    this.register('stageMessages', Meteor.subscribe('stageMessages', {
      onReady() {
        subsReady += 1;
        checkIfSubsAreReady(subs, subsReady);
      },
    }));
  },
  action() {
    mount(App, {
      children: [<Header />, <Editor />],
    });
  },
});
