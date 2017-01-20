import React from 'react';

let Modal = require("react-bootstrap").Modal;
let Alert = require("react-bootstrap").Alert;
let Button = require("react-bootstrap").Button;
let Input = require("react-bootstrap").Input;
let Row = require("react-bootstrap").Row;
let Col = require("react-bootstrap").Col;
let Panel = require("react-bootstrap").Panel;

let DefaultModal = React.createClass({

  getInitialState() {
    return {
      showModal: false,
      title: '',
      bodyMessage : '',
      alertStyle: 'info'
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  open(title, bodyMessage, alertStyle) {
    this.setState(
      {
        showModal: true,
        title: title,
        bodyMessage : bodyMessage,
        alertStyle : alertStyle
      }
    );
  },

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert bsStyle={this.state.alertStyle}>
              {this.state.bodyMessage}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

export default DefaultModal;
