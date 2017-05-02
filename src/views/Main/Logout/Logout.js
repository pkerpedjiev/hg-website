import React, { Component, PropTypes } from 'react';
import { PropTypes as T } from 'prop-types';

class Logout extends Component {
  static contextTypes = {
    router: T.object
  }

    constructor(props, context) {
        super(props, context);
    }

  componentDidMount(){
    this.props.auth.logout();
    this.context.router.push('/');
  }

  render() {
    return (
      <h1 className="loading-text">
        Logging out...
      </h1>
    );
  }
}

export default Logout;
