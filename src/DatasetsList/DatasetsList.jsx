import React from 'react'
import {json} from 'd3-request';
import slugid from 'slugid';
import {dictValues} from '../utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import EditTable from '../MaterialUiTableEdit/MaterialUiTableEdit.jsx';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class DatasetsList extends React.Component {
    constructor(props) {
        super(props)

        // the servers supplying tileset data
        this.trackSourceServers = new Set(["http://higlass.io/api/v1"]);
        this.serverDataPositions = {};
        this.serverDataCounts = {};

        this.pageSize = 10;

        // how many entries we've received from each server so far
        // necessary for pagination
        for (let server of this.trackSourceServers) {
            this.serverDataPositions[server] = 0;
            this.serverDataCounts[server] = 0;
        }

        // fetch the first two pages of results
        this.requestTilesetLists(0);
        this.requestTilesetLists(this.pageSize);

        this.state = {
            tilesets: [],
            currentDataPosition: 0
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

        // allTilesets = allTilesets.concat(entries);
        // need to be sorted

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

    requestTilesetLists(offset) {
        /**
         * Request a list of the tilesets from each known server.
         */
        let sent = 0;
        let finished = 0;

        this.trackSourceServers.forEach( sourceServer => {
            sent += 1;
            json(sourceServer + '/tilesets/?limit=' + this.pageSize + "&offset=" + offset,
                 function(error, data) {
                    finished += 1;

                    if (error) {
                        console.error('ERROR:', error);
                    } else {
                        console.log('data:', data);
                        let newTilesets = this.prepareNewEntries(sourceServer, 
                                                                 data.results, 
                                                                 this.state.tilesets);

                                                                 //this.serverDataPositions[sourceServer] += data.results.length;
                        this.serverDataCounts[sourceServer] = data.count;

                        this.setState({
                            tilesets: newTilesets
                        });
                    }

                    if (finished === sent) {
                        // all requests have been loaded
                        console.log('All loaded...');
                        console.log('serverDataPositions:', this.serverDataPositions);
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

    handleNextPage() {
        /**
         * Move on to the next page of results
         */

        let maxDataCount = dictValues(this.serverDataCounts).reduce((a,b) => a+b, 0);
        console.log('maxDataCount:', maxDataCount);


        // fetch the next page, we should always be two pages ahead
        this.requestTilesetLists(this.state.currentDataPosition + this.pageSize);

        this.setState({
            currentDataPosition: Math.min(this.state.currentDataPosition + this.pageSize,
                                          maxDataCount)
        });
    }

    handlePrevPage() {
        /**
         * Return to the previous page of results
         */
        this.setState({
            currentDataPosition: Math.max(this.state.currentDataPosition - this.pageSize,
                                          0)

        });
    }

    render() {
        console.log('currentDataPosition:', this.state.currentDataPosition);
        console.log('this.state.tilesets:', this.state.tilesets);

        let datasets1 = dictValues(this.state.tilesets)
        .slice(this.state.currentDataPosition, this.state.currentDataPosition + this.pageSize)
        .map(x => {
            return {"columns": [{"value": x.uuid}, {"value": x.name}]}; 
        })

        console.log('this.state.tilesets:', this.state.tilesets);
        console.log('datasets:', datasets1);

        const headers = [
            {value: 'UID', type: 'TextField', width: 200},
            {value: 'Name', type: 'TextField', width: 200}
        ]

        return(
            <div>
                <Toolbar> 
                    <ToolbarGroup firstChild={true} lastChild={true}>

                        <TextField 
                            hintText="Filter by text"
                            floatingLabelText="Filter"
                        >
                        </TextField>

                    </ToolbarGroup>
                </Toolbar>
                <EditTable
                    rows={ datasets1 }
                    headerColumns={headers}
                />
                <a onClick={this.handlePrevPage.bind(this)}>{"Prev"}</a>
                ...
                <a onClick={this.handleNextPage.bind(this)}>{"next"}</a>
            </div>
        );
    }
}
