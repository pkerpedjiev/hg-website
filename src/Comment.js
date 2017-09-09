import React from 'react';
import {json, request} from 'd3-request';

import "./Comment.module.css";

export default class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.commentServer = 'http://127.0.0.1:8001';

    this.state = {
      replyOpen: false,
      replyValue: ""
    }
  }

  handleTextAreaChange(evt) {
    this.setState({
      replyValue: evt.target.value
    });
  }

  handleDeleteComment() {
    let targetUrl = this.commentServer + "/c/" + this.props.comment.uid;

    console.log('sending delete');

    request(targetUrl)
      .header("Content-Type", "application/json")
      .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
      .send('DELETE', function(error, data) {
        if (error && error.target) {
          console.error("Error deleting comment:", error.target.response);
        } else {
          console.log('successfully deleted comment', data);
          //this.props.onCommentDeleted(JSON.parse(data.response));
          this.props.onCommentDeleted(this.props.comment.uid);
        }
      }.bind(this));
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
          this.setState({ replyOpen: false });
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
        <button
        onClick={() => this.setState({replyOpen: true})}
        >
        reply
        </button>
        <span>{" "}</span>
        <button
        onClick={this.handleDeleteComment.bind(this)}
        >
        delete
        </button>

        </div>
      )
    }

    return(<div>
      {this.props.comment.content}
        {replySection}
      </div>)
  }
}
