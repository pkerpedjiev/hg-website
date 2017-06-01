import React from 'react'
import {json} from 'd3-request';
import slugid from 'slugid';
import {dictValues} from '../utils';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

export default class DatasetsList extends React.Component {
    constructor(props) {
        super(props)

        this.trackSourceServers = ["http://higlass.io/api/v1"];
        this.requestTilesetLists();

        this.state = {
            tilesets: []
        }
    }
    prepareNewEntries(sourceServer, newEntries, existingTilesets) {
        /**
         * Add meta data to new tileset entries before adding
         * them to the list of available tilesets:
         *
         * Arguments
         * ---------
         *
         *  sourceServer : string
         *      The server that these entries are coming from
         *      e.g. "http://higlass.io/api/v1"
         *
         *  newEntries : [{},...]
         *      The list of new tileset entries to be added, as returned
         *      by the server. e.g. {"uuid:", "xxx", "name": "blah"...}
         *
         *  existingTilesets : []
         *      The list of already known (retrieved tilesets)
         *      
         *
         * Returns
         * -------
         *
         *  []
         *  The updated list of tilesets
         *
         */
        let allTilesets = existingTilesets;

        let entries = newEntries.map(ne => {
            let ane = Object.assign({}, ne, {
                server: sourceServer,
                tilesetUid: ne.uuid,
                serverUidKey: this.serverUidKey(sourceServer, ne.uuid),
                datatype: ne.datatype,
                name: ne.name,
                uid: slugid.nice()
            });

            return ane;
        });

        entries.forEach(ne => {
            allTilesets[ne.serverUidKey] = ne;
        });

        return allTilesets;
    }

    serverUidKey(server, uid) {
        /**
         * Create a key for a server and uid
         *
         * Arguments
         * ---------
         *  server : string
         *      The server that a tileset came from e.g. "higlass.io/api/v1"
         *
         *  uid : string
         *      The uid of the dataset: e.g. "xxyxx"
         *
         * Returns
         * -------
         *  string
         *      Some combination of the server and uid that can be used as 
         *      a unique key for this dataset
         *
         */
        return server + '/' + uid;

    }

    requestTilesetLists() {
        /**
         * Request a list of the tilesets from each known server.
         */
        this.trackSourceServers.forEach( sourceServer => {
            json(sourceServer + '/tilesets/',
                 function(error, data) {
                    if (error) {
                        console.error('ERROR:', error);
                    } else {
                        console.log('data:', data);
                        let newTilesets = this.prepareNewEntries(sourceServer, 
                                                                 data.results, 
                                                                 this.state.tilesets);

                        console.log('new tilesets', newTilesets);
                        this.setState({
                            tilesets: newTilesets
                        });
                    }
                }.bind(this));
        });

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

    render() {
        let datasets = dictValues(this.state.tilesets).map(x => {
            return(
                <li key={x.uuid}>
                    <TextField
                        id={x.uuid + "-name"}
                        disabled={true}
                        defaultValue={x.name}
                    />
                    <TextField
                        id={x.uuid + "-uuid"}
                        disabled={true} 
                        defaultValue={x.uuid}
                    />
                </li>);
        })
        console.log('datasets:', datasets);

        return(
            <div>
                <ul>
                    {datasets}
                </ul>
            </div>
        );
    }
}
