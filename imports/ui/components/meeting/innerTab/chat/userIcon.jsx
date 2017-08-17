import React, {Component, PropTypes} from 'react';

let defaultUserImage = '/img/defaultUserImage_140x140.png';

let UserIcon = React.createClass({
    render: function() {
        return(
          <div ref="target" className="userIcon">
              <img className={this.props.status} src= {(this.props.user.profile && this.props.user.profile.avatar)? this.props.user.profile.avatar : defaultUserImage} />
              <div className={this.props.pulse} id={this.props.user.username}></div>
              <span>{this.props.spanText}</span>
          </div>
        );
    }
});

export default UserIcon;
