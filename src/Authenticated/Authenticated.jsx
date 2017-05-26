import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';

const Authenticated = ({ auth, ...rest }) => (
  <Route {...rest} render={(props) => {
    return auth.loggedIn() ?
    (React.createElement(component, { ...props, loggingIn, authenticated })) :
    (<Redirect to="/login" />);
  }} />
);

Authenticated.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
};

export default Authenticated;
