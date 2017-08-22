import React from 'react';

const Modal = require('react-bootstrap').Modal;
const Alert = require('react-bootstrap').Alert;
const ProgressBar = require('react-bootstrap').ProgressBar;

const LoadingModal = React.createClass({
  getInitialState() {
    return {
      showModal: false,
    };
  },
  componentDidMount() {
    require('./loadingModal.less');
  },
  close() {
    this.setState({ showModal: false });
  },
  open(errorMessage) {
    this.setState(
      {
        showModal: true,
      },
    );
  },
  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Body>
            <div className="ispinner gray animating">
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="ispinner-blade" />
              <div className="loading-label">Loading...</div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  },

});

export default LoadingModal;
