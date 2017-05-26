import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';

const Public = ({ auth, ...rest }) => (
  <Route {...rest} render={(props) => {
    return (!auth.loggedIn()) ? 
    (React.createElement(component, { ...props })) :
    (<Redirect to="/home" />);
  }} />
);

Public.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
};

export default Public;
