import React from 'react'
import {Button} from 'react-bootstrap'
import {text} from 'd3-request';
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'
import { PropTypes as T } from 'prop-types';

export class Home extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  logout(){
    this.props.auth.logout()
    this.context.router.push('/login');
  }

  hitServer() {
      console.log('hitting', AuthService);
    text('http://localhost:8000/api/v1/which_user/')
    .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
    .get((text) => {
        console.log('text:', text);
    })
  }

  render(){
      console.log('profile:', this.state.profile);
    const { profile } = this.state
    return (
      <div className={styles.root}>
        <h2>Home</h2>
        <p>Welcome {profile.name}!</p>
        <Button onClick={this.logout.bind(this)}>Logout</Button>
        <Button onClick={this.hitServer.bind(this)}>Hit Server</Button>
      </div>
    )
  }
}

export default Home;
