import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/client/index';

import App from '../imports/ui/App';

Meteor.startup(() => {
  require('sweetalert/dist/sweetalert.css');
  render(<App />, document.getElementById('render-target'));
});
