import React from 'react';
import {json, request} from 'd3-request';
import Comment from './Comment';

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

  handleCommentAdded(newComment) {
    this.setState({
      retrievedComments: this.state.retrievedComments.concat([newComment])
    });
  }

  handleCommentDeleted(uid) {
    this.setState({
      retrievedComments: this.state.retrievedComments.filter(x => x.uid !== uid)
    });
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
    let eligibleComments = comments.filter(x => x.parent_uid === parentUid);
    //console.log('building dom tree', comments, parentUid);

    return (<ul>
      {
        eligibleComments.map(x => {
          let children = comments.filter(y => y.parent_uid === x.uid);
          //console.log('children:', children);
          let html = [(<li><Comment 
              onCommentAdded={this.handleCommentAdded.bind(this)}
              onCommentDeleted={this.handleCommentDeleted.bind(this)}
              comment={x}  
            />
            </li>)]

          if (children.length > 0) {
            html.push(<ul>
              { this.buildDOMTree(comments, x.uid)}
              </ul>)
          }
          return html;
        })
      }
      </ul>
    );
  }

  submitComment(event) {
    let targetUrl = this.commentServer + "/c/"
    let postContent = JSON.stringify({
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
      <div className="comment-add">

      <textarea
        value={this.state.commentText}
        onChange={(evt) => this.setState({commentText:evt.target.value})}
      />
      <button
        onClick={this.submitComment.bind(this)}
      >
        {"Submit"}
      </button>
      </div>
      <ul>
        {this.buildDOMTree(this.state.retrievedComments, this.props.sourceUid)}
      </ul>
      </div>

    );
  }
}
