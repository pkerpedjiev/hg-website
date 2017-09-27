import React from 'react'
import {json,request} from 'd3-request';
import AWS from 'aws-sdk';

export default class UploadFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    }
  }

  handleUploadFinished() {

  }

  finishHgServerUpload(path) {
    let postContent = JSON.stringify({'filepath': path});
    console.log('postContent', postContent);

    request('http://127.0.0.1:8000/api/v1/finish_file_upload/')
      .header("Content-Type", "application/json")
      .send('POST', postContent, function(error, data) {
      if (error) {
        console.warn('error:', error);
      } else {
        console.log('data:', data.response);
        this.props.onNewFileUploaded();
      }
    }.bind(this));
  }

  uploadFileToAWS(file, accessKeyId, secretAccessKey, 
    sessionToken, uploadPrefix, fileDirectory)  {
    /**
     * Upload a file to an S3 bucket
     *
     * Parameters
     * ----------
     *
     * file: File
     *  The file object to upload
     * accessKeyId: string
     *  The aws access key
     * secretAccessKey: string
     *  The secret amazon access key
     * sessionToken: string
     *  The session token to use for upload
     * uploadPrefix:
     *  The prefix to prepend to this file before sending it so that
     *  it gets placed in the right location.
     * fileDirectory:
     *  The directory that this individual file will be put in. This
     *  should be a subset of the uploadPrefix.
     *
     * Returns
     * -------
     *  None
     */

    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken
    });

    console.log('accesKey:', accessKeyId);
    console.log('secretAccessKey', secretAccessKey);
    console.log('sessionToken', sessionToken);
    console.log('uploadPrefix', uploadPrefix)

    console.log('file:', file.name)
    var key = uploadPrefix + "/" + file.name
    console.log('key:', key);
    //var key = "tmp/test.txt";
    var s3 = new AWS.S3();
    var ret = s3.upload({Bucket: "resgen-test", Key: key, Body: file });
    console.log('ret:', ret);

    ret.on('httpUploadProgress', function(progress) {
      console.log('progress:', progress.loaded, progress.total);

    });

    ret.send(function(err, data) {
      console.log('err:', err);
      console.log('data:', data);
      this.finishHgServerUpload(fileDirectory + '/' + file.name);
    }.bind(this));
  }

  handleFileSelected(evt) {
    var files = evt.target.files; // FileList object
    console.log('files:', files);

    json('http://127.0.0.1:8000/api/v1/prepare_file_upload/', function(error, data) {
      if (error) {
        console.warn("Error retrieveing credentials: ", error);
        this.setState({
          error: error
        });
      } else {
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
          this.uploadFileToAWS(f, 
            data.accessKeyId,
            data.secretAccessKey,
            data.sessionToken,
            data.uploadBucketPrefix,
            data.fileDirectory
          );

          this.setState({
            error: null
          })
        }
      }
    }.bind(this));
    return;

  }

  render() {

    return (
      <div>
        <input type="file" id="files" name="files"  
          onChange={this.handleFileSelected.bind(this)}
        />
        { this.state.error ?  <span>{JSON.stringify(this.state.error, null, 2)}</span> : null }

      </div>
      )
  }
}
