import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

export default class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addingServer: true,
            serverFieldText: ''
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
        this.props.onAddTrackSourceServer(this.state.serverFieldText);

        this.setState({
            serverFieldText: '',
            addingServer: false
        });
    }

    render() {
        console.log('addingServer:', this.state.addingServer);
        console.log('a:', [...this.props.settings.trackSourceServers].map(server => server));

        return (
            <div>
                <ul>
                    { [...this.props.settings.trackSourceServers].map(server =>
                        (<li key={server}> {server} </li>))
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
