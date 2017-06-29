import React from 'react'
import {json} from 'd3-request';
import slugid from 'slugid';
import {dictValues} from '../utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import EditTable from '../MaterialUiTableEdit/MaterialUiTableEdit.jsx';
import TextField from 'material-ui/TextField';
import './styles.module.css';

export default class DatasetsList extends React.Component {
    constructor(props) {
        super(props)

        // the servers supplying tileset data
        //this.trackSourceServers = new Set(["http://higlass.io/api/v1"]);
        this.trackSourceServers = new Set(["http://127.0.0.1:8000/api/v1"]);
        this.serverDataPositions = {};
        this.serverDataCounts = {};

        this.pageSize = 10;

        this.headers = [
            {value: 'UID', field: 'uuid', type: 'TextField', width: 100},
            {value: 'Name', field: 'name', type: 'TextField', width: 300},
            {value: 'Datatype', field: 'datatype', type: 'TextField', width: 100}
        ]

        // how many entries we've received from each server so far
        // necessary for pagination
        for (let server of this.trackSourceServers) {
            this.serverDataPositions[server] = 0;
            this.serverDataCounts[server] = 0;
        }

        // fetch the first two pages of results
        this.requestTilesetLists(0);
        this.requestTilesetLists(this.pageSize);

        this.searchValue = "";

        //let targetUrl = row.server + "/tilesets/" + newEntry.uuid + "/"
        let targetUrl = "http://127.0.0.1:8000/api/v1/tilesets/aa/"
        json(targetUrl, function(error, data) {
            console.log('error:', error.target.response);
            console.log('data:', data);
        });

        this.state = {
            tilesets: [],
            currentDataPosition: 0,
            sortBy: null
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
            let ane = {
                server: sourceServer,
                tilesetUid: ne.uuid,
                serverUidKey: this.serverUidKey(sourceServer, ne.uuid),
                datatype: ne.datatype,
                name: ne.name,
                uid: slugid.nice(),
                entry: ne
            };

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

    requestTilesetLists(offset, sortBy) {
        /**
         * Request a list of the tilesets from each known server.
         */
        let sent = 0;
        let finished = 0;

        this.trackSourceServers.forEach( sourceServer => {
            sent += 1;
            let targetUrl = sourceServer + '/tilesets/?limit=' + this.pageSize + "&offset=" + offset

            if (this.searchValue && this.searchValue.length > 0)
                targetUrl += "&ac=" + this.searchValue;
            if (sortBy)
                targetUrl += "&s=" + sortBy;

            json(targetUrl,
                 function(error, data) {
                    finished += 1;

                    if (error) {
                        console.error('ERROR:', error);
                    } else {
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

  handleSortBy(columnName) {
      /**
       * The user has chosen a sort order. This is usually
       * accomplished by clicking on one of the columns
       *
       * Arguments
       * ---------
       *
       *  columnName: string
       *    The name of the column to sort by
       *
       * Returns:
       * -------
       *
       *  nothing
       */
      // if someone clicks the column currently being sorted by,
      // undo sorting
      if (columnName === this.state.sortBy)
          columnName = null;

      this.setState({
          sortBy: columnName
      });
  }

    handleFilterChanged(event, newValue) {
        /**
         * The datset filter search box field changed
         *
         * Arguments
         * ---------
         *  event: object
         *      Change event targeting the text field.
         *  newValue: string
         *      The new value of the text field.
         */
        this.searchValue = newValue;

        // clear all previously retrieved tilesets
        this.setState({
            currentDataPosition: 0
        });

        // we're going to the top of the list
        this.requestTilesetLists(0);
    }

    handleRowChange(row) {
        /**
         * A row was changed in the editable table.
         *
         * We need to update the server.
         *
         * Arguments:
         *  row: {columns: Array(3), id: 0, selected: true}
         *
         *  Where each column is an object like this: { header: null, value: "blah" ...}
         *
         *  The object value names need to come from somewhere else.
         */
        console.log('handleRowChange row:', row);
        let newEntry = {};

        for (let header of this.headers) {
            newEntry[header.field] = row.entry[header.field];
        }


        console.log('newEntry:', newEntry);
    }

    render() {
        let datasets1 = dictValues(this.state.tilesets)
        .filter(x => {
            if (this.searchValue.length)
                return x.name.toLowerCase().includes(this.searchValue.toLowerCase());
            return true;
        })

        if (this.state.sortBy)
            datasets1 = datasets1.sort((a,b) => 
                                       a[this.state.sortBy.toLowerCase()]
                                       .localeCompare(b[this.state.sortBy.toLowerCase()]));

        datasets1 = datasets1.slice(this.state.currentDataPosition, this.state.currentDataPosition + this.pageSize)

        return(
            <div>
                        <TextField 
                            style={{ "display" : "block", "margin": "auto", "marginBottom": "10px" }}
                            hintText=""
                            floatingLabelText="Filter datasets"
                            onChange={this.handleFilterChanged.bind(this)}
                        >
                        </TextField>
                <EditTable
                    rows={ datasets1 }
                    onRowChange={ this.handleRowChange.bind(this) }
                    sortyBy={this.state.sortBy}
                    headerColumns={this.headers}
                    onSortBy={this.handleSortBy.bind(this)}
                    sortBy={this.state.sortBy}
                />
                <div 
                    style={{
                        marginTop: 20,
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 80
                    }}
                >
                    <img src="img/backward.svg" 
                        alt="Previous datasets"
                        width="30px"
                        onClick={this.handlePrevPage.bind(this)}
                        className={"navigation-button"}
                    />
                    <img src="img/forward.svg" 
                        alt="Next datasets"
                        width="30px"
                        onClick={this.handleNextPage.bind(this)}
                        className={"navigation-button"}
                    />
                </div>
            </div>
        );
    }
}
