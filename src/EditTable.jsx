import EditableTableEntry from './EditableTableEntry.jsx';
import CommentsArea from './CommentsArea/CommentsArea.js';
import React from 'react';

export default class EditTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      headerColumns: [],
      rows: [],
    }
  }

  getInitialState() {
    return {
      rows: this.props.rows,
      hoverValue: false,
      currentRow: false
    }
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({rows: nextProps.rows});
  }

  render() {

    let rows = this.state.rows;

    /*
    if (!this.props.loaded) {
      // create dummy rows
        rows = [];
        for (let i = 0; i < this.props.maxRows; i++) {
            let row = {entry: {}};

            for (let headerColumn of this.props.headerColumns) {
                row.entry[headerColumn.field] = '';
            }

            rows.push(row);
        }
    }
    */

      return (
        <div className='container' >
        {rows.map(row => {
          return (<div
            >

            <EditableTableEntry 
              headerColumns={this.props.headerColumns}
              row={row} 
              onStartRowEditing={this.props.onRowSelected}
              onEndRowEditing={this.props.onRowChanged}
            />

            <CommentsArea
              sourceUid={row.tilesetUid} 
            >

            </CommentsArea>
            </div>
          )
        })}
        </div>
      )
  }
}
