import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import HGViewer from './HGViewer/HGViewer';
import history from './history';
import DatasetsList from './DatasetsList/DatasetsList.jsx'
import SettingsComponent from './SettingsComponent/SettingsComponent.jsx'

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export default class AllRoutes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: { 
                trackSourceServers: new Set(['http://127.0.0.1:8000/api/v1'])
            }
        }
    }

    handleAddTrackSourceServer(serverUrl) {
        console.log('serverUrl:', serverUrl);
        let settings = this.state.settings;
        settings.trackSourceServers.add(serverUrl);

        this.setState({
            settings: settings
        });
    }

    render() {
      return (
          <BrowserRouter history={history} component={App}>
            <div>
              <Route path="/" render={(props) => <App auth={auth} {...props} />} />
              <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
              <Route path="/viewer" render={(props) => <HGViewer auth={auth} {...props} />} />
              <Route path="/datasets" render={(props) => <DatasetsList auth={auth} {...props} />} />
              <Route path="/settings" render={(props) => 
                  <SettingsComponent 
                    auth={auth} 
                    settings={this.state.settings}
                    onAddTrackSourceServer={this.handleAddTrackSourceServer.bind(this)}
                    {...props} 
                    onSettingsChanged={() => { console.log("hi") }} />} />
              <Route path="/login" render={(props) => {
                auth.login();
                return <Home auth={auth} {...props} />
              }} />
              <Route path="/logout" render={(props) => {
                auth.logout();
                return <Home auth={auth} {...props} />
              }} />
              <Route path="/callback" render={(props) => {
                handleAuthentication(props);
                return <Callback {...props} /> 
              }}/>
            </div>
          </BrowserRouter>
      );
    }
}
