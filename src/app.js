import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.css'
import './app.css'

import App from 'src/App/App'

const mountNode = document.querySelector('#root');
ReactDOM.render(
  <App  />,
mountNode);
