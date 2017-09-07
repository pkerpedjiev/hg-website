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
      replyOpen: true
    }
  }

  render() {
    let replySection;

    if (this.state.replyOpen) {
      replySection = (
        <div
          className={"comment-reply"}
        >
          <div>
            <textarea />
          </div>
          <div className="comment-reply-buttons">
            <button>{"Submit"}</button>
            <button>{"Cancel"}</button>
          </div>
        </div>
      )
    } else {
      replySection = (
        <div>
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
