import React from 'react'
import {json,request} from 'd3-request';
import slugid from 'slugid';
import {dictValues} from '../utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import EditTable from '../MaterialUiTableEdit/MaterialUiTableEdit.jsx';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

import './styles.module.css';

export default class DatasetsList extends React.Component {
    constructor(props) {
        super(props)

        // the servers supplying tileset data
        //this.trackSourceServers = new Set(["http://higlass.io/api/v1"]);
        this.serverDataPositions = {};
        this.serverDataCounts = {};

        this.rowsBeforeEditing = {};

        this.pageSize = 5;
        this.sent = 0;
        this.finished = 0;

        this.headers = [
            {value: 'UID', field: 'uuid', type: 'TextField', width: 100},
            {value: 'Name', field: 'name', type: 'TextField', width: 300},
            {value: 'Datatype', field: 'datatype', type: 'TextField', width: 100},
            {value: 'Created', field: 'created', type: 'TextField', width: 200},
            {value: 'Server', field: 'server', type: 'TextField', width: 200},
            {value: 'Owner', field: 'owner', type: 'TextField', width: 200}
        ]

        // how many entries we've received from each server so far
        // necessary for pagination
        for (let server of this.props.trackSourceServers) {
            this.serverDataPositions[server] = 0;
            this.serverDataCounts[server] = 0;
        }

        // fetch the first two pages of results

        this.searchValue = "";
        this.tilesets = [];
        this.currentDataPosition = 0;

        this.state = {
            updatingRow: false,
            errorMessage: "",
            tilesets: [],
            currentDataPosition: 0,
            sortBy: 'name|desc'
        }

    }

    componentDidMount() {
        this.requestTilesetLists(0, this.state.sortBy);
        this.requestTilesetLists(this.pageSize, this.state.sortBy);
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
                created: ne.created,
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

        this.props.trackSourceServers.forEach( sourceServer => {
            this.sent += 1;
            let targetUrl = sourceServer + '/tilesets/?limit=' + this.pageSize + "&offset=" + offset

            if (this.searchValue && this.searchValue.length > 0)
                targetUrl += "&ac=" + this.searchValue;

            if (sortBy) {
                // sortby definitions are of the form "created|asc" or "created|desc"
                // the 'asc' or 'desc' indicates ascending or descending
                let parts = sortBy.split('|');
                let first = parts.slice(0,parts.length-1).join('|');
                let second = parts.slice(parts.length-1, parts.length);

                targetUrl += "&o=" + first;

                if (second[0] === 'desc')
                    targetUrl += "&r=1";

            }

            //console.log('sending:', targetUrl);
            this.setState({
                loaded: false
            });

            json(targetUrl,
                 function(error, data) {
                    this.finished += 1;
                    //console.log('receiving:', targetUrl);

                    if (error) {
                        console.error('ERROR:', error);
                    } else {
                        let newTilesets = this.prepareNewEntries(sourceServer, 
                                                                 data.results, 
                                                                 this.tilesets);

                                                                 //this.serverDataPositions[sourceServer] += data.results.length;
                        this.serverDataCounts[sourceServer] = data.count;

                        this.tilesets = newTilesets;
                    }

                    if (this.finished === this.sent) {
                        this.setState({
                            loaded: true,
                            currentDataPosition: this.currentDataPosition,
                            tilesets: this.tilesets
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

    handleNextPage() {
        /**
         * Move on to the next page of results
         */

        let maxDataCount = dictValues(this.serverDataCounts).reduce((a,b) => a+b, 0);

        // fetch the next page, we should always be two pages ahead
        this.requestTilesetLists(this.currentDataPosition + this.pageSize, this.state.sortBy);

        // we don't set the state here but rather wait until we're sure
        // we have the data in requestTilesetLists
        this.currentDataPosition = Math.min(this.currentDataPosition + this.pageSize, maxDataCount);

    }

    handlePrevPage() {
        /**
         * Return to the previous page of results
         */

        this.currentDataPosition = Math.max(this.state.currentDataPosition - this.pageSize, 0)
        this.setState({
            currentDataPosition: this.currentDataPosition

        });
    }

  handleSortBy(evt, index, columnName) {
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

      this.currentDataPosition = 0;
      this.tilesets = [];

      this.setState({
          sortBy: columnName,
          currentDataPosition: this.currentDataPosition
      });

      this.requestTilesetLists(0, columnName);
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
        this.currentDataPosition = 0;

        // clear all previously retrieved tilesets
        this.setState({
            currentDataPosition: 0
        });

        // we're going to the top of the list
        this.requestTilesetLists(0, this.state.sortBy);
    }

    handleRowSelected(row) {
        /**
         * A row has been selected in the editable table. When someone
         * is done editing it, they will click on "done" and handleRowChange
         * will be called.
         *
         * This function should never be called while another row
         * is being updated on the server.
         *
         * Arguments:
         *  row: {server: "127.0.0.1/api/v1", entry: ...}
         */

        this.rowsBeforeEditing[row.serverUidKey] = JSON.parse(JSON.stringify(row.entry));
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
        let newEntry = {};

        for (let header of this.headers) {
            newEntry[header.field] = row.entry[header.field];
        }

        //let targetUrl = "http://127.0.0.1:8000/api/v1/tilesets/aa/"
        let targetUrl = row.server + "/tilesets/" + newEntry.uuid + "/"

        request(targetUrl)
        .header("Content-Type", "application/json")
        .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
        .send('PATCH', JSON.stringify(newEntry), function(error, data) {
            if (error && error.target) {
                let tilesets = this.state.tilesets;
                let changedTileset = tilesets[row.serverUidKey];

                changedTileset.entry = this.rowsBeforeEditing[row.serverUidKey];

                this.setState({
                    tilesets: tilesets,
                    loading: false,
                    errorMessage: error.target.response
                });
            } else {
                let tilesets = this.state.tilesets;
                let changedTileset = tilesets[row.serverUidKey];

                changedTileset.entry = row.entry;

                this.setState({
                    tilesets:  tilesets,
                    loading: false
                });
            }

        }.bind(this));

        // assume the request is going to succeed and switch to the
        // new (edited) tileset
        let tilesets = this.state.tilesets;
        let changedTileset = tilesets[row.serverUidKey];

        changedTileset.entry = row.entry;

        this.setState({
            tilesets:  tilesets,
        });

    }

    render() {
        let datasets1 = dictValues(this.state.tilesets)


        .filter(x => {
            if (this.searchValue.length)
                return x.name.toLowerCase().includes(this.searchValue.toLowerCase());
            return true;
        })


        if (this.state.sortBy) {
            let parts = this.state.sortBy.split('|');
            let first = parts.slice(0,parts.length-1).join('|');
            let second = parts.slice(parts.length-1, parts.length)[0];

            if (second === 'desc') {
                datasets1 = datasets1.sort((a,b) => 
                                           -a[first.toLowerCase()]
                                           .localeCompare(b[first.toLowerCase()]));
            } else {
                datasets1 = datasets1.sort((a,b) => 
                                           a[first.toLowerCase()]
                                           .localeCompare(b[first.toLowerCase()]));
            }
        }

        datasets1 = datasets1.slice(this.state.currentDataPosition, this.state.currentDataPosition + this.pageSize)

        return(
            <div>
                <Toolbar
                    style={{
                        backgroundColor: '#FFF',
                        marginBottom: 20
                    }}
                >
                    <ToolbarGroup
                        firstChild={true}
                    >
                        <FontIcon 
                            className="material-icons"
                            style={{
                                paddingLeft: 0,
                                marginLeft: 56,
                                marginRight: 5}}
                        >
                            {"filter_list"}
                        </FontIcon>

                        <TextField 
                            style={{
                                }}
                            hintText=""
                            floatingLabelText=""
                            onChange={this.handleFilterChanged.bind(this)}
                        >
                        </TextField>

                        <FontIcon 
                            className="material-icons"
                            style={{marginRight: 5}}
                        >
                            {"sort"}
                        </FontIcon>

                        <SelectField
                            floatingLabelText={""}
                            value={this.state.sortBy}
                            onChange={this.handleSortBy.bind(this)}
                        >
                            { 
                                this.headers.map(x => {
                                    return [(<MenuItem 
                                                value={x.field + "|asc"}
                                                key={x.field + "-asc"}
                                                primaryText={x.value + " Ascending"}
                                            />),(<MenuItem 
                                                value={x.field + "|desc"}
                                                key={x.field + "-desc"}
                                                primaryText={x.value + " Descending"}
                                            />)
                                            ]
                                })
                            }
                        </SelectField>
                    </ToolbarGroup>
                </Toolbar>
                <EditTable
                    rows={ datasets1 }
                    onRowChange={ this.handleRowChange.bind(this) }
                    onRowSelected={ this.handleRowSelected.bind(this) }
                    sortyBy={this.state.sortBy}
                    headerColumns={this.headers}
                    onSortBy={this.handleSortBy.bind(this)}
                    sortBy={this.state.sortBy}
                    maxRows={this.pageSize}
                />
                <div 
                    style={{
                        marginTop: 20,
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 80
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            jusitfyContent: "center"
                            }}
                    >
                    <img src="img/backward.svg" 
                        alt="Previous datasets"
                        width="30px"
                        height="60px"
                        onClick={this.handlePrevPage.bind(this)}
                        className={"navigation-button"}
                    />
                    { this.sent === this.finished ?
                        <div
                            style={{
                                minWidth: 60,
                                height: 60
                                }}
                        />
                        :
                        <img src="img/spinner.gif" 
                            alt="Loading..."
                            width="60px"
                            height="60px"
                        />
                        }

                    <img src="img/forward.svg" 
                        alt="Next datasets"
                        width="30px"
                        height="60px"
                        onClick={this.handleNextPage.bind(this)}
                        className={"navigation-button"}
                    />
                </div>
                    { this.state.updatingRow ? "Updating" : "Not updating" }
                    <br />
                    { "sent:" + this.sent + "Received:" + this.finished + "Error: " + this.state.errorMessage }
                </div>
            </div>
        );
    }
}
