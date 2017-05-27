import React from 'react';
import { Link } from 'react-router-dom'
import styles from './styles.module.css';

export default class Nav extends React.Component {
    render() {

        let loggedInLinks = (<div>
            <Link className={styles.headerItem} to="/viewer"><span>Viewer</span></Link>
            <Link className={styles.headerItem} to="/datasets"><span>Datasets</span></Link>
            <Link to='/logout'><span>Logout</span></Link>
                             </div>);
        let loggedOutLinks = (<div>
            <Link className={styles.headerItem} to="/viewer"><span>Viewer</span></Link>
            <Link to="/datasets" className={styles.headerItem}><span>Datasets</span></Link>
            <Link to='/login'><span>Login</span></Link>
                             </div>);


        console.log('logged in', this.props.auth.isAuthenticated())
        let linksToDisplay = this.props.auth.isAuthenticated() ? loggedInLinks : loggedOutLinks;

            return (
          <div className={styles.navBar} >
            {"Navbar"}
            <div>
                <Link to="/home">HiGlass</Link>
            </div>
            <div>
                {linksToDisplay}
            </div>
          </div>
        );
    }
}
