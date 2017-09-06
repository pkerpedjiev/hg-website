import React from 'react';
import { Link } from 'react-router-dom'
import './styles.module.css';

export default class Nav extends React.Component {
  render() {

    let loggedInLinks = (<div>
      <Link className={"headerItem"} to="/viewer"><span>Viewer</span></Link>
      <Link className={"headerItem"} to="/datasets"><span>Datasets</span></Link>
      <Link className={"headerItem"} to="/settings"><span>Settings</span></Link>
      <Link className={"headerItem"} to='/logout'><span>Logout</span></Link>
      </div>);
    let loggedOutLinks = (<div>
      <Link className={"headerItem"} to="/viewer"><span>Viewer</span></Link>
      <Link className={"headerItem"} to="/datasets"><span>Datasets</span></Link>
      <Link className={"headerItem"} to="/settings"><span>Settings</span></Link>
      <Link className={"headerItem"} to='/login'><span>Login</span></Link>
      </div>);


    console.log('logged in', this.props.auth.isAuthenticated())
    let linksToDisplay = this.props.auth.isAuthenticated() ? loggedInLinks : loggedOutLinks;

    return (
      <div className={"navBar"} >
      <Link to="/home">HiGlass</Link>
      <div>
      {linksToDisplay}
      </div>
      </div>
    );
  }
}
