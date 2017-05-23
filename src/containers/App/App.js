import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router } from 'react-router-dom';

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired
  };

  get content() {
    return (
      <Router
        routes={this.props.routes}
        history={this.props.history} />
    )
  }

  render () {
     return (
       <div style={{ height: '100%' }}>
         {this.content}
       </div>
     )
   }
}

export default App;
