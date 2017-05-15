import Resumable from 'resumablejs';
import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes as T } from 'prop-types';
import AuthService from 'utils/AuthService'

export default class DatasetsList extends React.Component {
    constructor() {
        super();
    }

  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  componentDidMount() {

  }

  render() {
    return (
        <div>
        </div>
    );
  }
}
