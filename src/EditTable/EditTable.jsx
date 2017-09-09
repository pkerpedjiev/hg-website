import EditableTableEntry from '../EditableTableEntry/EditableTableEntry.jsx';
import CommentsArea from '../CommentsArea/CommentsArea.js';
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

  handleRowClick(row) {
    var rows = this.state.rows
    const rowId = row.id;

    if (rows[rowId].selected && this.props.onRowChange)
      this.props.onRowChange(row);
    else
      this.props.onRowSelected(row);

    rows.forEach((row, i) => {
      if (rowId !== i) row.selected = false
    })

    rows[rowId].selected = !rows[rowId].selected
    this.setState({rows: rows})
  }

  renderHeader() {
    const headerColumns = this.props.headerColumns
    const columns = headerColumns.map((column, id) => {
      return {value: column.value}
    })
    const row = {columns: columns, header: true}

    const checkboxStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 24
    }

    const rowStyle = {
      //width: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: row.header ? 0 : 8,
      border: 0,
      borderBottom: '0px solid #ccc',
      height: 30
    }

    return (
      <div key={"header"} style={rowStyle}>
      <div style={checkboxStyle} />
      { 
        headerColumns.map((header, id) => {
          const width = header.width

          let cellStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            flexGrow: 0.15,
            flexBasis: 'content',
            padding: '5px',
            height: 30,
            width: width || 200
          }

          if (this.props.sortBy === header.field && !this.props.reverseSort)
            cellStyle.background = "#aaa";
          if (this.props.sortBy === header.field && this.props.reverseSort)
            cellStyle.background = "#0aa";

          return (
            <div 
            key={"header-" + id}
            className='cell' 
            onClick={() => this.props.onSortBy(header.field)}
            style={cellStyle}>
            <div>
            {header.value}
            </div>
            </div>)
        })
      }
      </div>
    );
  }


  componentWillReceiveProps(nextProps) {
    this.setState({rows: nextProps.rows});
  }

  render() {
    const style = {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      fontFamily: 'Roboto, sans-serif'
    }


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
        <div className='container' style={style}>
        {rows.map((row, id) => {
          row.id = id;
          return (<div
            key={row.id}
            >
            <EditableTableEntry 
            headerColumns={this.props.headerColumns}
            row={row} 
            onRowClick={this.handleRowClick.bind(this)}
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
