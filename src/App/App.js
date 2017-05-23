import AuthService from 'utils/AuthService'
import {Grid} from 'react-bootstrap';
import Nav from 'src/Nav/Nav'
import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter as Router } from 'react-router-dom';
const auth = new AuthService('tjaJsFZBcHshIStuYIjVxsMEOpyYEH3n', 'higlass.auth0.com');

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
      console.log('Nav:', Nav);
     return (
         <Router>
           <div style={{ height: '100%' }}>
            <Nav auth={auth}/>
            <Grid>
                 
             </Grid>
           </div>
       </Router>
     )
   }
}

export default App;
