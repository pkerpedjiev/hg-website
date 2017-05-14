import React from 'react';
import { Link } from 'react-router'
import styles from './styles.module.css';

export class Nav extends React.Component {
    render() {
        let loggedInLinks = (<div>
            <Link className={styles.headerItem} to="/datasets"><span>Datasets</span></Link>
            <Link to='/logout'><span>Logout</span></Link>
                             </div>);
        let loggedOutLinks = (<div>
            <Link to="/datasets"><span>Datasets</span></Link>
            <Link to='/login'><span>Login</span></Link>
                             </div>);


        console.log('logged in', this.props.auth.loggedIn())
        let linksToDisplay = this.props.auth.loggedIn() ? loggedInLinks : loggedOutLinks;

            return (
          <div className={styles.navBar} >
            <div>
                Header
            </div>
            <div>
                {linksToDisplay}
            </div>
          </div>
        );
    }
}
