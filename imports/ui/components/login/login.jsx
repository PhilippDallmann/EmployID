import {Meteor} from 'meteor/meteor';
import React from 'react';
import UserActions from "../../reflux/actions/userActions";
import UserStore from "../../reflux/stores/userStore";

//import LOGO_URL from "../assets/img/employid_logo_xlarge.png";
var LOGO_URL = "../assets/img/employid_logo_xlarge.png";

let Input = require("react-bootstrap").Input;
let ButtonInput = require("react-bootstrap").ButtonInput;
let Overlay = require("react-bootstrap").Overlay;
let Tooltip = require("react-bootstrap").Tooltip;
let Row = require("react-bootstrap").Row;
let Col = require("react-bootstrap").Col;
let Image = require("react-bootstrap").Image;

const INVALID_DURATION = 500;

let Login = React.createClass({
    getInitialState: function() {
        return {
            isRegisterFormShowing: false,
            showInvalidAnimation: true,

            username: "",
            userEmail: "",
            userPassword: "",
            validationMessages : {
              username: null,
              userEmail: null,
              userPassword: null
            }
        }
    },
    componentWillMount: function() {
        document.title = "Login | EmployID";
    },
    componentDidMount: function() {
        require("./login.less");
    },
    toggleRegisterLoginForms: function() {
      this.emptyValidationMessages();
      this.setState({
          isRegisterFormShowing: !this.state.isRegisterFormShowing
      });
    },
    handleUsernameChange: function(e) {
      this.setState({
          username: e.target.value
      });
    },
    handleEmailChange: function(e) {
        this.setState({
            userEmail: e.target.value
        });
    },
    handlePasswordChange: function(e) {
        this.setState({
            userPassword: e.target.value
        });
    },
    login: function(e) {
        e.preventDefault();

        var me = this;
        if (!Shower.loginForm) {
            Shower({
                name: "loginForm",
                fields: {
                    userEmail: {
                        required: true,
                        format: 'email',
                        message: "Email is not valid"
                    },
                    userPassword: {
                        required: true,
                        message: "Password is required"
                    }
                }
            });
        }

        var loginFormData = {userEmail: this.state.userEmail, userPassword: this.state.userPassword};

        Shower.loginForm.validate(loginFormData, function(errors, formData) {
            if (!errors) {
                  UserActions.login(me.state.userEmail, me.state.userPassword);
                  me.emptyValidationMessages();
            } else {

              me.emptyValidationMessages();

              var updatedValidationMessages = me.state.validationMessages;

              for (var key in errors) {
                  updatedValidationMessages[key] = errors[key].message;
              }

              me.setState(
                  {
                    validationMessages: updatedValidationMessages
                  }
              );

            }
        });

    },
    register: function(e) {
        e.preventDefault();

        var me = this;
        if (!Shower.registerForm) {
            Shower({
                name: "registerForm",
                fields: {
                    userEmail: {
                        required: true,
                        format: 'email',
                        message: "Email is not valid"
                    },
                    userPassword: {
                        required: true,
                        message: "Password is required"
                    },
                    username: {
                        required: true,
                        message: "Username is required"
                    }
                }
            });
        }

        var registerFormData = {username: this.state.username, userEmail: this.state.userEmail, userPassword: this.state.userPassword};

        Shower.registerForm.validate(registerFormData, function(errors, formData){
            if (!errors) {
                  UserActions.register(me.state.username, me.state.userEmail, me.state.userPassword);
                  me.emptyValidationMessages();
            } else {
              me.emptyValidationMessages();

              var updatedValidationMessages = me.state.validationMessages;

              for (var key in errors) {
                  updatedValidationMessages[key] = errors[key].message;
              }

              me.setState(
                  {
                    validationMessages: updatedValidationMessages
                  }
              );
            }
        });
    },
    emptyValidationMessages: function() {

      var updatedValidationMessages = this.state.validationMessages;

      for (var key in this.state.validationMessages) {
          updatedValidationMessages[key] = null;
      }

      this.setState(
        {
          validationMessages: updatedValidationMessages
        }
      );

    },
    render: function() {
        var loginForm =
            <div>
                <ButtonInput className="login-button" type="submit" value="Login" onClick={this.login}/>
                <a id="forgot-password-link" className="additional-link"></a>
                <a id="signup-link" className="additional-link pull-right" onClick= {this.toggleRegisterLoginForms}>Create account</a>
            </div>

        var registerForm =
            <div>
                <Input ref="usernameInput" type="text" label="Username" placeholder="Enter username" onChange={this.handleUsernameChange}
                  bsStyle={(this.state.validationMessages.username == null) ? null : 'error'} hasFeedback/>
                <Overlay show={(this.state.validationMessages.username != null)} target={props => ReactDOM.findDOMNode(this.refs.usernameInput)} placement="right">
                    <Tooltip id="usernameTooltip">{this.state.validationMessages.username}</Tooltip>
                </Overlay>

                <ButtonInput className="login-button" type="submit" value="Create account" onClick={this.register}/>
                <a id="back-to-login-link" className="additional-link pull-right" onClick={this.toggleRegisterLoginForms}>Login</a>
            </div>

        return (
          <Row>
            <Col className="logo" sm={0} md={6}>
              <h1>Welcome</h1>
              <Image responsive={true} className="logo" src={LOGO_URL}></Image>
            </Col>
            <Col className="login" sm={12} md={6}>
              <div id="login-container">
                  <form>
                      <Input ref="userEmailInput" type="email" label="Email Address" placeholder="Enter email" onChange={this.handleEmailChange}
                        bsStyle={(this.state.validationMessages.userEmail == null) ? null : 'error'} hasFeedback />
                      <Overlay show={(this.state.validationMessages.userEmail != null)} target={props => ReactDOM.findDOMNode(this.refs.userEmailInput)} placement="right">
                          <Tooltip id = "userEmailTooltip">{this.state.validationMessages.userEmail}</Tooltip>
                      </Overlay>

                      <Input ref="userPasswordInput" type="password" placeholder="Enter password" label="Password" onChange={this.handlePasswordChange}
                        bsStyle={(this.state.validationMessages.userPassword == null) ? null : 'error'} hasFeedback />
                      <Overlay show={(this.state.validationMessages.userPassword != null)} target={props => ReactDOM.findDOMNode(this.refs.userPasswordInput)} placement="right">
                          <Tooltip id = "userPasswordTooltip">{this.state.validationMessages.userPassword}</Tooltip>
                      </Overlay>

                      {this.state.isRegisterFormShowing? registerForm : loginForm}
                  </form>
              </div>
            </Col>
          </Row>
        );
    }
});

export default Login;
