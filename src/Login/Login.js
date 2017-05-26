import React from 'react'
import {ButtonToolbar, Button} from 'react-bootstrap'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'
import { PropTypes as T } from 'prop-types';
import { hitServer } from 'utils/APIUtils';

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
      console.log('this.props:', this.props);
    const { auth } = this.props
    return (
      <div className={styles.root}>
        <h2>Login</h2>
        <ButtonToolbar className={styles.toolbar}>
          <Button bsStyle="primary" onClick={auth.login.bind(this)}>Login</Button>
          <Button onClick={() => hitServer(localStorage.getItem('id_token'))}>Hit Server</Button>
        </ButtonToolbar>
      </div>
    )
  }
}

export default Login;
