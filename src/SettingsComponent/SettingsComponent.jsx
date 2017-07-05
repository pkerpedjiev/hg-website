import React from 'react'

export default class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: props.settings
        }
    }

    render() {
        return (
            <div>
                <ul>
                    { this.state.settings.trackSourceServers.map(server =>
                        (<li key={server}> {server} </li>))
                    }
                </ul>
            </div>
        );
    }
}
