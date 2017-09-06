import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {request} from 'd3-request';

export default class CommentsArea extends React.Component {
  constructor(props) {
    super(props);

    this.commentServer = "http://127.0.0.1:8001";

    this.state = {
      commentText: "This is a test comment"
    }

  }

  submitComment(event) {
    const targetUrl = this.commentServer + "/c/"
    const postContent = JSON.stringify({
      "source_uid": this.props.sourceUid,
      "parent_uid": this.props.sourceUid,
      content: this.state.commentText
    })

    console.log('postContent', postContent);

    request(targetUrl)
      .header("Content-Type", "application/json")
      .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
      .send('POST', postContent, function(error, data) {
        if (error && error.target) {
          console.error("Error posting comment:", error.target.response);
        } else {
          console.log('successfully added top level comment', data);
        }
      });
  }

  render() {
    return(
      <div>
      <TextField
        hintText="Message Field"
        floatingLabelText="MultiLine and FloatingLabel"
        multiLine={true}
        rows={2}
        value={this.state.commentText}
        onChange={(event, newValue) => this.setState({commentText:newValue})}
      />
      <RaisedButton 
      label="Submit" 
      fullWidth={true} 
      onClick={this.submitComment.bind(this)}
      />
      </div>

    );
  }
}
