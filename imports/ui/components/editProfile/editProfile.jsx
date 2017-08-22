import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TAPi18n } from 'meteor/tap:i18n';
import { createContainer } from 'meteor/react-meteor-data';
import React, { PropTypes, Component } from 'react';
import swal from 'sweetalert2';

const Reflux = require('reflux');

import LoadingActions from '../../../reflux/actions/loadingActions';
// import LoadingS from "../../../reflux/stores/userStore";

const Button = require('react-bootstrap').Button;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Panel = require('react-bootstrap').Panel;

const defaultUserImage = '/img/defaultUserImage_140x140.png';


class EditProfile extends Reflux.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.currentUser && this.props.currentUser.username,
      userEmail: this.props.currentUser && this.props.currentUser.emails && this.props.currentUser.emails[0].address,
      userFirstName: this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.firstName,
      userLastName: this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.lastName,
      userAvatar: this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.avatar,

      userDataSaveButtonDisabled: true,
      userImageUploadButtonDisabled: true,
    };

    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.handleImageFileChange = this.handleImageFileChange.bind(this);
    this.onUploadImageButtonClick = this.onUploadImageButtonClick.bind(this);
  }
  componentWillMount() {
    document.title = TAPi18n.__('editProfile.documentTitle');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      username: nextProps.currentUser && nextProps.currentUser.username,
      userEmail: nextProps.currentUser && nextProps.currentUser.emails && nextProps.currentUser.emails[0].address,
      userFirstName: nextProps.currentUser && nextProps.currentUser.profile && nextProps.currentUser.profile.firstName,
      userLastName: nextProps.currentUser && nextProps.currentUser.profile && nextProps.currentUser.profile.lastName,
      userAvatar: nextProps.currentUser && nextProps.currentUser.profile && nextProps.currentUser.profile.avatar,

      userDataSaveButtonDisabled: true,
    });
  }
  handleLastNameChange(e) {
    this.setState({
      userLastName: e.target.value,
      userDataSaveButtonDisabled: false,
    });
  }
  handleFirstNameChange(e) {
    this.setState({
      userFirstName: e.target.value,
      userDataSaveButtonDisabled: false,
    });
  }
  onSaveChangesClick(e) {
    // UserActions.updateUser(this.state.userFirstName, this.state.userLastName);
    const fieldValueArray = [['profile.firstName', this.state.userFirstName], ['profile.lastName', this.state.userLastName]];
    Meteor.call('updateUserProfile', this.props.currentUser._id, fieldValueArray);
    this.setState({
      userDataSaveButtonDisabled: true,
    });
  }
  handleImageFileChange() {
    const me = this;
    const file = document.getElementById('userImageFileInput').files[0];
    me.readImage(file, (error, file) => {
      if (!error) {
        me.setState({
          userAvatar: file.result,
          userImageUploadButtonDisabled: false,
        });
      } else {
        me.setState({
          userImageUploadButtonDisabled: true,
        });
        swal({
          title: 'Error',
          text: error,
        });
      }
    });
  }
  onUploadImageButtonClick() {
    LoadingActions.setLoading();
    const me = this;
    const fieldValueArray = [['profile.avatar', this.state.userAvatar]];
    Meteor.call('updateUserProfile', this.props.currentUser._id, fieldValueArray, (error) => {
      if (error) {
        LoadingActions.unsetLoading();
        swal({
          title: 'Error',
          text: error,
        });
      } else {
        me.setState({
          userImageUploadButtonDisabled: true,
        });
        LoadingActions.unsetLoading();
      }
    });
  }
  readImage(file, callback) {
    const FILEUPLOAD = {
      IMG: { TYPE: ['image/jpeg', 'image/png'], MAXSIZE: 3072000 }, // 3072 kb
    };

    const reader = new FileReader();
    reader.onload = function (e) {
      // check file
      if (!_.contains(FILEUPLOAD.IMG.TYPE, file.type)) {
        callback(new Meteor.Error(412, 'File format not supported. Please upload .jpg or .png'));
        return;
      }
      // check size
      if (file.size > FILEUPLOAD.IMG.MAXSIZE) {
        callback(new Meteor.Error(412, 'File is too large. 512kb size limit'));
        return;
      }
      file.result = e.target.result;
      callback(null, file);
    };
    reader.onerror = function () {
      callback(reader.error);
    };
    reader.readAsDataURL(file);
  }
  render() {
    const userDataForm =
      (<FormGroup>
        <FormControl type="text" disabled value={this.state.username} />
        <FormControl type="email" disabled value={this.state.userEmail} />
        <FormControl type="text" placeholder={TAPi18n.__('editProfile.enterFirstName')} value={this.state.userFirstName} onChange={this.handleFirstNameChange} />
        <FormControl type="text" placeholder={TAPi18n.__('editProfile.enterLastName')} value={this.state.userLastName} onChange={this.handleLastNameChange} />
        <Button type="submit" onClick={this.onSaveChangesClick} disabled={this.state.userDataSaveButtonDisabled}>{TAPi18n.__('editProfile.saveChanges')}</Button>
      </FormGroup>);

    const userImageForm =
        (<div>
          <div>
            <img id="userImage" src={this.state.userAvatar ? this.state.userAvatar : defaultUserImage} className="userImage" />
          </div>
          <FormGroup>
            <FormControl id="userImageFileInput" type="file" onChange={this.handleImageFileChange} />
            <Button id="userImageUploadButton" type="submit" onClick={this.onUploadImageButtonClick} disabled={this.state.userImageUploadButtonDisabled}>{TAPi18n.__('editProfile.uploadImage')}</Button>
          </FormGroup>
        </div>);

    return (
      <div className="editProfile">
        <Grid fluid>
          <Row>
            <Col sm={12} md={6} lg={6}>
              <Panel>{userImageForm}</Panel>
            </Col>
            <Col sm={12} md={6} lg={6}>
              <Panel>{userDataForm}</Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default createContainer(() => ({
  currentUser: Meteor.user(),
}), EditProfile);
