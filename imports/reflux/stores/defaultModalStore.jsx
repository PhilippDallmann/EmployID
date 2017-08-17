import { TAPi18n } from 'meteor/tap:i18n';
import swal from 'sweetalert2';
import DefaultModalActions from '../actions/defaultModalActions';

const Reflux = require('reflux');

const DefaultModalStore = Reflux.createStore({
  listenables: [DefaultModalActions],
  onShowError(err) {
    swal(TAPi18n.__('defaultModal.error'), err);
  },
  onShowWarning(msg) {
    swal(TAPi18n.__('defaultModal.warning'), msg);
  },
  onShowInfo(title, bodyMessage) {
    swal(title, bodyMessage);
  },
});

export default DefaultModalStore;
