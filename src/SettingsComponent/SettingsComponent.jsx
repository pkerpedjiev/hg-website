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
            settings: props.settings,
            addingServer: false
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

    render() {
        console.log('anchroEl:', this.state.anchorEl);
        console.log('open', this.state.open);
        return (
            <div>
                <ul>
                    { this.state.settings.trackSourceServers.map(server =>
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
                        <Menu>
                            <MenuItem>
                                <Toolbar>
                                    <ToolbarGroup firstChild={true}>
                                        <TextField hintText="http://higlass.io/api/v1" />
                                    </ToolbarGroup>
                                    <ToolbarGroup>
                                        <RaisedButton
                                            onTouchTap={this.handleAddServer}
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
