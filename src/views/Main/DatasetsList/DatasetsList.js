import Resumable from 'resumablejs';
import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes as T } from 'prop-types';
import AuthService from 'utils/AuthService'

export default class DatasetsList extends React.Component {
    constructor() {
    super()
    this.state = { files: [] }
    this.resumable = new Resumable({

    });

    console.log('this.resumable:', this.resumable);
  }

  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  componentDidMount() {
    this.resumable.assignBrowse(ReactDOM.findDOMNode(this.dropDiv));
    this.resumable.assignDrop(ReactDOM.findDOMNode(this.dropDiv));
  }

  render() {
      console.log('render');
    return (
      <section>
        <div ref={c => this.dropDiv = c} style={{border: "1px solid black"}}>
            <p>Try dropping some files here, or click to select files to upload.</p>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}
