import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import { browserHistory } from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import Home from './Home/Home'
import Login from './Login/Login'
import Logout from './Logout/Logout'
import DatasetsList from './DatasetsList/DatasetsList.js'
import HGViewer from '../../../src/HGViewer/HGViewer.jsx'

const auth = new AuthService('tjaJsFZBcHshIStuYIjVxsMEOpyYEH3n', 'higlass.auth0.com');

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth} history={browserHistory} >
      <IndexRedirect to="/home" />
      <Route path="home" component={Home} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="datasets" component={DatasetsList} />
      <Route path="viewer" component={HGViewer} />
    </Route>
  )
}

export default makeMainRoutes
