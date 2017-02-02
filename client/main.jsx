import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

import App from '../imports/ui/App.jsx';
import '/imports/startup/client/index';

Meteor.startup(() => {
  require('sweetalert/dist/sweetalert.css');
  render(<App />, document.getElementById('render-target'));
});