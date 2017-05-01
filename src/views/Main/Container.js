import React from 'react'
import { Jumbotron } from 'react-bootstrap'
import styles from './styles.module.css'
import {PropTypes as T} from 'prop-types'
import { Nav } from '../../../src/Nav/Nav.js'

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  render() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }

    return (
      <div>
          <Nav />
          <Jumbotron>
            <h2 className={styles.mainTitle}>
              <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" />
            </h2>
            {children}
          </Jumbotron>
      </div>
    )
  }
}

export default Container;
