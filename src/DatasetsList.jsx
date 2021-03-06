import React from 'react'
import {json,request} from 'd3-request';
import slugid from 'slugid';
import {dictValues} from './utils';
import EditableTableEntry from './EditableTableEntry.jsx';
import CommentsArea from './CommentsArea.js';

import './DatasetsList.module.css';
import './Comment.module.css';
import ForwardBackPage from './ForwardBackPage.js';
import UploadFile from './UploadFile.jsx';

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
      {value: 'Filetype', field: 'filetype', type: 'TextField', width: 100},
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

  dbRecordToRow(dbRecord, sourceServer) {
    /**
     * Store a database record as a row that we'll display in
     * our table
     *
     * Parameters
     * ----------
     *  dbRecord: string
     *    The database record to use as the basis for this row
     *  sourceServer: string
     *    The server that this entry came from
     */

    let row = {
      server: sourceServer,
      tilesetUid: dbRecord.uuid,
      serverUidKey: this.serverUidKey(sourceServer, dbRecord.uuid),
      datatype: dbRecord.datatype,
      filetype: dbRecord.filetype,
      name: dbRecord.name,
      uid: slugid.nice(),
      created: dbRecord.created,
      entry: dbRecord
    };

    return row;
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

    let entries = newEntries.map(ne => this.dbRecordToRow(ne, sourceServer));

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

    this.currentDataPosition = 0;
    this.tilesets = [];

    this.setState({
      sortBy: columnName,
      currentDataPosition: this.currentDataPosition
    });

    this.requestTilesetLists(0, columnName);
  }

  handleNewFileUploaded() {
    /*
     * A new file has been uploaded so we should refresh
     * the list of datasets
     */
    // clear all previously retrieved tilesets
    this.setState({
      currentDataPosition: 0
    });

    // we're going to the top of the list
    this.requestTilesetLists(0, this.state.sortBy);

  }

  handleFilterChanged(newValue) {
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

  handleDeleteRow(row) {
    /**
     * Delete an entry from the database
     *
     * Paremeters
     * ----------
     *  row: {server: '127.0.0.1/api/v1', entry: ...}
     */
    let targetUrl = row.server + "/tilesets/" + row.entry.uuid + "/";

    request(targetUrl)
      .header('Authorization', 'JWT ' + localStorage.getItem('id_token'))
      .send('DELETE', function(error, data) {
        console.log('error:', error);
        console.log('data:', data);
        if (error && error.target) {
          // couldn't delete the entry so nothing happens
        } else {
          // the entry was deleted;
          let tilesets = this.state.tilesets;

          delete tilesets[row.serverUidKey];
          this.setState({
            tilesets: tilesets
          });
        }
      }.bind(this));
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
     * This function caches the value of the row so that it there is
     * an error updating the row on the server, its value can be 
     * restored
     *
     * Arguments:
     *  row: {server: "127.0.0.1/api/v1", entry: ...}
     */

    this.rowsBeforeEditing[row.serverUidKey] = JSON.parse(JSON.stringify(row.entry));
  }

  handleRowChanged(row) {
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
          console.log('reverting', changedTileset.entry);

          this.setState({
            tilesets: tilesets,
            loading: false,
            errorMessage: error.target.response
          });
        } else {
          let tilesets = this.state.tilesets;
          let changedTileset = tilesets[row.serverUidKey];

          changedTileset.entry = row.entry;
          tilesets[row.serverUidKey] = this.dbRecordToRow(row.entry, row.server);

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

    console.log('datasets1:', datasets1);


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
    console.log('datasets1', datasets1);

    return(
      <div>
      <UploadFile
        onNewFileUploaded={this.handleNewFileUploaded.bind(this)}
      />
      <input 
      type="text"
      onChange={(evt) => this.handleFilterChanged(evt.target.value)}
      />


      <select
        onChange={(evt) => this.handleSortBy(evt.target.value)} 
      >

      { 
        this.headers.map(x => {
          return [(<option
            value={x.field + "|asc"}
            >{x.field + "|asc"}</option>),
            (<option
              value={x.field + "|desc"}
              >{x.field + "|desc"}</option>)
          ]
        })
      }
      </select>

      { datasets1.map( row => {
        console.log('row:', row);
        return (
          <div
          key={row.uid}
        >
          <div>
            <EditableTableEntry
              row={row}
              editableFields={{'name': 1, 'datatype': 1, 'filetype': 1 }}
              displayFields={['tilesetUid', 'name', 'datatype', 'filetype', 'created']}
              onStartRowEditing={this.handleRowSelected.bind(this)}
              onEndRowEditing={this.handleRowChanged.bind(this)}
              onDeleteRow={this.handleDeleteRow.bind(this)}
            />
            <hr />
            {/*
            <CommentsArea
              sourceUid={row.tilesetUid}
            />
            */}
          </div>
        </div>
        )})}
      <ForwardBackPage 
        onPrevPage={this.handlePrevPage.bind(this)}
        onNextPage={this.handleNextPage.bind(this)}
        processing={this.sent !== this.finished}
      />
      { this.state.updatingRow ? "Updating" : "Not updating" }
      <br />
      { "sent:" + this.sent + "Received:" + this.finished + "Error: " + this.state.errorMessage }
      </div>
    );
  }
}
