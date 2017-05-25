import AuthService from 'utils/AuthService'
import {Grid} from 'react-bootstrap';
import Nav from 'src/Nav/Nav'
import Home from 'src/Home/Home'
import Login from 'src/Login/Login'
import React from 'react';
import PropTypes from 'prop-types';
import Authenticated from 'src/Authenticated/Authenticated.jsx';
import Public from 'src/Public/Public.jsx';

import { BrowserRouter as Router } from 'react-router-dom';
const auth = new AuthService('tjaJsFZBcHshIStuYIjVxsMEOpyYEH3n', 'higlass.auth0.com');

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render () {
      console.log('Nav:', Nav);
     return (
         <Router>
           <div style={{ height: '100%' }}>
            <Nav auth={auth}/>
              <Grid>
                    <Authenticated exact path="/home" component={Home} />
                    <Public path="/login" component={Login} />
             </Grid>
           </div>
       </Router>
     )
   }
}

export default App;
