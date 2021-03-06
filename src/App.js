import React, { Component } from 'react';
import './App.css';
import Nav from './Nav/Nav.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
      <Nav auth={this.props.auth}/>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
