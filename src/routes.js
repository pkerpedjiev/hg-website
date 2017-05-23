import React from 'react'
import {browserHistory, Router, Route, Redirect} from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import makeMainRoutes from './views/Main/routes'

export const makeRoutes = () => {
const main = makeMainRoutes();

const NotFound = () => (
    <h1>404: Page Not Found</h1>
)

  return (
    <BrowserRouter>
      {main}
      <Route path='*' component={NotFound} / >
    </BrowserRouter>
  )
}



export default makeRoutes
