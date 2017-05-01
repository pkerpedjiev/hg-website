import React from 'react';
import { Link } from 'react-router'
import styles from './styles.module.css';

export const Nav = () => (
  <div className={styles.navBar} >
    <div>
        Header
    </div>
    <div>
        <Link to='/'><span>Home</span></Link>&nbsp;
        <Link to='/address'><span>Address</span></Link>
    </div>
  </div>
)
