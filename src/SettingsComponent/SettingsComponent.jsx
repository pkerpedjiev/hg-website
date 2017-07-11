import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import {json} from 'd3-request';

export default class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addingServer: false,
            serverFieldText: 'http://127.0.0.1:8989/api/v1',
            serverError: null
        }
    }

    contextTypes: {
        muiTheme: React.PropTypes.object.isRequired
    }

    static childContextTypes =
    {
        muiTheme: React.PropTypes.object
    }

    getChildContext()
    {
        return {
            muiTheme: getMuiTheme()
        }
    }

    handleServerFieldChange(e) {
        this.setState({
            serverFieldText: e.target.value 
        });
    }

    handleOpenAddServerMenu(event) {
        this.setState({
            addingServer: true,
            anchorEl: event.currentTarget
        });
    }

    handleRequestClose() {
        this.setState({
            addingServer: false
        });
    }

    focusTextField(input) {
        console.log('input:', input);
        if (input) {
            input.focus();
            //setTimeout(() => { input.focus()}, 100 )
        }
    }

    handleAddTrackSourceServer(serverUrl) {
        let targetUrl = this.state.serverFieldText + '/tilesets';
        
        json(targetUrl, (error, result) => {
            if (error) {
                console.log('error:', error)
                this.setState({
                    serverError: "Invalid server"
                });

            } else {
                console.log('result:', result);
                this.props.onAddTrackSourceServer(this.state.serverFieldText);

                this.setState({
                    serverError: "",
                    serverFieldText: '',
                    addingServer: false
                });
            }
        });
    }

    render() {
        console.log('addingServer:', this.state.addingServer);
        console.log('a:', [...this.props.settings.trackSourceServers].map(server => server));

        return (
            <div>
                <ul>
                    { [...this.props.settings.trackSourceServers].map(server =>
                        (<li key={server}> 
                            
                            {server} 

                                <FontIcon 
                                    className="material-icons"
                                    onClick={() => this.props.onRemoveTrackSourceServer(server)}
                                >
                                    clear
                                </FontIcon>
                            
                            </li>))
                    }
                </ul>
                <RaisedButton
                    onTouchTap={this.handleOpenAddServerMenu.bind(this)}
                    label={"Add Server"}
                >
                    <Popover
                        open={this.state.addingServer}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{'horizontal': 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose.bind(this)}
                    >
                        <Menu
                            disableAutoFocus={true}
                        >

                            <MenuItem>
                                <Toolbar>
                                    <ToolbarGroup firstChild={true}>
                                        <TextField 
                                            errorText={this.state.serverError}
                                            ref={this.focusTextField}
                                            hintText="http://127.0.0.1:8989/api/v1" 
                                            onChange={this.handleServerFieldChange.bind(this)}
                                            value={this.state.serverFieldText}
                                        />
                                    </ToolbarGroup>
                                    <ToolbarGroup>
                                        <RaisedButton
                                            onTouchTap={this.handleAddTrackSourceServer.bind(this)}
                                            label={"Add"}
                                        />
                                    </ToolbarGroup>
                                </Toolbar>
                            </MenuItem>
                        </Menu>
                    </Popover>
                </RaisedButton>
            </div>
        );
    }
}
