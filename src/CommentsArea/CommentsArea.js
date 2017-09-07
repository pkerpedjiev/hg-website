import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {json, request} from 'd3-request';
import Comment from '../Comment/Comment';

export default class CommentsArea extends React.Component {
  constructor(props) {
    super(props);

    this.commentServer = "http://127.0.0.1:8001";

    this.state = {
      commentText: "This is a test comment",
      retrievedComments: []
    }

  }

  componentDidMount() {
    this.refreshComments();
  }

  refreshComments() {
    let targetUrl = this.commentServer + "/c/?su=" + this.props.sourceUid;
    json(targetUrl, function(error, data) {
        if (error && error.target) {
          console.error("Error posting comment:", error.target.response);
        } else {
          console.log('successfully retrieved comments', data);
          this.setState({
            retrievedComments: data
          });
        }
    }.bind(this));

  }

  /**
   * Build a tree of lists encompassing the
   * comments
   *
   * Parameters
   * ----------
   *  comments : list
   *    A list of comment objects
   *  parentUid: string
   *    The use only the children of this node for the
   *    tree
   */
  buildDOMTree(comments, parentUid) {
    let eligibleComments = comments.filter(x => x.parent_uid == parentUid);

    return (<ul>
      {
        eligibleComments.map(x => {
          let children = comments.filter(x => x.parent_uid == x.uid);
          let html = [(<li><Comment 
              comment={x}  
            />
            </li>)]

          if (children.length > 0) {
            html.push(<ul>
              { this.buildDOMTree(children, x.uid)}
              </ul>)
          }
          return html;
        })
      }
      </ul>
    );
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
          this.refreshComments();
        }
      }.bind(this));
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
      <ul>
        {this.buildDOMTree(this.state.retrievedComments, this.props.sourceUid)}
      </ul>
      </div>

    );
  }
}
