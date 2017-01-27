import {Meteor} from 'meteor/meteor';
import React from 'react';

import UserActions from "../../../reflux/actions/userActions";
import UserStore from "../../../reflux/stores/userStore";

//import logoUrl from "../../assets/img/logo_31x36.png"
var logoUrl = '../assets/img/logo_31x36';

import LoadingActions from "../../../reflux/actions/loadingActions";
import LoadingStore from "../../../reflux/stores/loadingStore";

let Navbar = require("react-bootstrap").Navbar;
let Nav = require("react-bootstrap").Nav;
let NavItem = require("react-bootstrap").NavItem;
let NavDropdown = require("react-bootstrap").NavDropdown;
let MenuItem = require("react-bootstrap").MenuItem;
let Input = require("react-bootstrap").Input;
let Button = require("react-bootstrap").Button;

let Header = React.createClass({
    getInitialState: function() {
        return {
            username : Meteor.user() ? Meteor.user().username : ''
        }
    },
    componentDidMount: function() {
        require("./header.less");
        require("./languages.less")
    },
    logout: function() {
        UserActions.logout();
    },
    getNavbarStyle: function() {
          var navStyle = {};
          navStyle.display = (Meteor.user()) ? null : 'none';
          return navStyle;
    },
    onChangeLanguageClick: function(e) {
      localStorage.setItem('userLanguage', e.target.lang);
      LoadingActions.setLoading();
      location.reload();
    },
    render: function() {

        var me = this;
        Accounts.onLogin(function() {
            me.isMounted() && me.setState({
                username : Meteor.user() && Meteor.user().username
            });
        });

        return (
            <div id="header">
              <Navbar fluid inverse >
                  <Navbar.Header>
                      <Navbar.Brand>
                          <div className="brand-box">
                              <a href={location.origin + "/home"}>
                                  <img src={logoUrl} className="brand-logo" />
                                  {__("header.brandName")}
                              </a>
                          </div>
                      </Navbar.Brand>
                      <Navbar.Toggle />
                  </Navbar.Header>
                  <Navbar.Collapse>
                  <Nav pullRight>
                      <NavItem style={this.getNavbarStyle()} href={location.origin + "/home"}>{__("header.home")}</NavItem>
                      <NavItem style={this.getNavbarStyle()} href={"https://help.learnenv.com/help/peercoaching"}>{__("header.help")}</NavItem>
                      <NavDropdown style={this.getNavbarStyle()} id="nav-dropdown" title={this.state.username}>
                          <MenuItem href={location.origin + "/editProfile"}>
                              {__("header.editProfile")}
                          </MenuItem>
                          <MenuItem href={location.origin + "/users"}>
                              {__("header.userList")}
                          </MenuItem>
                          <MenuItem onSelect={this.logout}>
                              {__("header.logout")}
                          </MenuItem>
                      </NavDropdown>
                      <NavDropdown id="language-dropdown" title={<span className="lang-sm" lang={userLanguage}></span>}>
                        <MenuItem onSelect={this.onChangeLanguageClick}>
                            <span className="lang-sm lang-lbl" lang="en"></span>
                        </MenuItem>
                        <MenuItem onSelect={this.onChangeLanguageClick}>
                            <span className="lang-sm lang-lbl" lang="de"></span>
                        </MenuItem>
                      </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
        );
    }
});

export default Header;
