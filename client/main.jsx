/* global document */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/client/index';

import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
  require('sweetalert2/dist/sweetalert2.css');
  render(<App />, document.getElementById('render-target'));
});
