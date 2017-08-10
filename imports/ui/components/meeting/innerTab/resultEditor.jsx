import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import ReactQuill from 'react-quill';
import {TAPi18n} from 'meteor/tap:i18n';
import {createContainer} from 'meteor/react-meteor-data';

const CustomToolbar = () => (
  <div id="toolbar">
    <div className="result-panel-header">{TAPi18n.__("meeting.resultPanelHeader")}</div>
    <div className="toolbar-buttons">
      <select className="ql-header">
        <option value="1"/>
        <option value="2"/>
        <option selected/>
      </select>
      <button className="ql-bold"/>
      <button className="ql-italic"/>
      <select className="ql-color">
        <option value="red"/>
        <option value="green"/>
        <option value="blue"/>
        <option value="orange"/>
        <option value="violet"/>
        <option value="#d0d1d2"/>
        <option selected/>
      </select>
    </div>
  </div>
);

class ResultEditor extends Component{
  constructor(props) {
    super(props);

    this.state = {
      isRecorder: this.props.recorder==Meteor.userId(),
    };
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      isRecorder: this.props.recorder==Meteor.userId()
    });
  }
  componentDidMount() {
    require('../../../../../node_modules/react-quill/dist/quill.snow.css');
  }
  onChange(value) {
    Meteor.call('updateResultText', this.props.resultId, value);
  }
  render() {
      if(this.state.isRecorder) {
        return (
          <div className="text-editor">
            <CustomToolbar />
            <ReactQuill
              theme='snow'
              value={this.props.result}
              onChange={this.onChange}
              modules={ResultEditor.modules}
              readOnly={false}
            >
            </ReactQuill>
          </div>
        )
      } else {
        return (
          <div className="text-editor">
            <CustomToolbar />
            <ReactQuill
              theme='snow'
              value={this.props.result}
              modules={ResultEditor.modules}
              readOnly={true}
            >
            </ReactQuill>
          </div>
        )
      }
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
ResultEditor.modules = {
  toolbar: {
    container: "#toolbar",
  }
};

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
ResultEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color',
]

export default ResultEditor;
