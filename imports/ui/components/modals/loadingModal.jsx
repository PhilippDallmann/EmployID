import React from 'react';

let Modal = require('react-bootstrap').Modal;
let Alert = require('react-bootstrap').Alert;
let ProgressBar = require('react-bootstrap').ProgressBar;

let LoadingModal = React.createClass({
	getInitialState() {
		return {
			showModal: false
		};
	},
  componentDidMount: function() {
      require("./loadingModal.less");
  },
	close() {
		this.setState({ showModal: false });
	},
	open( errorMessage) {
		this.setState(
			{
				showModal: true
			}
		);
	},
	render() {

		return (
		<div>
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Body>
					<div className="ispinner gray animating">
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="ispinner-blade"></div>
						<div className="loading-label">Loading...</div>
					</div>
        </Modal.Body>
      </Modal>
    </div>
		);
	}

});

export default LoadingModal;
