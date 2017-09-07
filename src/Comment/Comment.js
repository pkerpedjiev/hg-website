import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {json, request} from 'd3-request';

import "./styles.module.css";

export default class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.commentServer = 'http://127.0.0.1:8001';

    this.state = {
      replyOpen: true,
      replyValue: ""
    }
  }

  handleTextAreaChange(evt) {
    this.setState({
      replyValue: evt.target.value
    });
  }

  handleSubmitComment() {
    let targetUrl = this.commentServer + "/c/"
    let postContent = JSON.stringify({
      "source_uid": this.props.comment.source_uid,
      "parent_uid": this.props.comment.uid,
      content: this.state.replyValue
    })

    console.log('this.props.comment', this.props.comment);
    console.log('postContent:', postContent);


    request(targetUrl)
      .header("Content-Type", "application/json")
      .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
      .send('POST', postContent, function(error, data) {
        if (error && error.target) {
          console.error("Error posting comment:", error.target.response);
        } else {
          console.log('successfully added top level comment', data);
          this.props.onCommentAdded(JSON.parse(data.response));
        }
      }.bind(this));
  }

  render() {
    let replySection;

    if (this.state.replyOpen) {
      replySection = (
        <div
          className={"comment-reply"}
        >
          <div>
            <textarea 
        onChange={ this.handleTextAreaChange.bind(this) }
        value={this.state.replyValue}
        />
          </div>
          <div className="comment-reply-buttons">
            <button
        onClick={this.handleSubmitComment.bind(this)}
        >{"Submit"}</button>
            <button
        onClick={() => this.setState({ replyOpen: false })}
        >{"Cancel"}</button>
          </div>
        </div>
      )
    } else {
      replySection = (
        <div className="comment-reply">
        <a 
        href={'#'}
        onClick={() => this.setState({replyOpen: true})}
        >
        reply
        </a>
        </div>
      )
    }

    return(<div>
      {this.props.comment.content}
        {replySection}
      </div>)
  }
}
