import swal from 'sweetalert2';

import LoadingActions from '../actions/loadingActions';

const Reflux = require('reflux');

const LoadingStore = Reflux.createStore({
  listenables: [LoadingActions],
  onSetLoading() {
    swal({});
    swal.showLoading();
  },
  onUnsetLoading() {
    swal.close();
  },

});

export default LoadingStore;
