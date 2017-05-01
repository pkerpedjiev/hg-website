import React from 'react'
import {browserHistory, Router, Route, Redirect} from 'react-router'

import makeMainRoutes from './views/Main/routes'

export const makeRoutes = () => {
const main = makeMainRoutes();

const NotFound = () => (
    <h1>404: Page Not Found</h1>
)

  return (
    <Route path=''>
      {main}
      <Route path='*' component={NotFound} / >
    </Route>
  )
}



export default makeRoutes
