const React = require('react')
const mui = require('material-ui')
const times = require('lodash.times')
const {RaisedButton} = mui

import EditableTableEntry from '../EditableTableEntry/EditableTableEntry.jsx';

export default class EditTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            headerColumns: [],
            rows: [],
            onChange: function () {}
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

      // somebody edited a row
      if (rows[rowId].selected)
          this.props.onChange(row);

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

    return (<EditableTableEntry row={row} headerColumns={this.props.headerColumns}/>);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({rows: nextProps.rows});
  }

  render() {
    const self = this
    const style = {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Roboto, sans-serif'
    }

    const buttonStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      marginTop: 10
    }

    const rows = this.state.rows
    const columnTypes = this.props.headerColumns.map((header) => {
      return header.type
    })

    const onButtonClick = (e) => {
      const newColumns = times(columnTypes.length, (index) => {
        const defaults = {
          'TextField': '',
          'Toggle': true
        }

        const value = defaults[columnTypes[index]]

        return {value: value}
      })

      const updatedRows = rows.map((row) => {
        if (row.selected) {
          self.update()
          row.selected = false
        }
        return row
      })
      updatedRows.push({columns: newColumns, selected: true})
      self.setState({rows: updatedRows})
    }

    return (
      <div className='container' style={style}>
        {this.renderHeader()}
        {rows.map((row, id) => {
            row.id = id;
            return (<EditableTableEntry 
                key={row.id}
                headerColumns={this.props.headerColumns}
                row={row} 
                onRowClick={() => this.handleRowClick(row)}
            />)
        })}
        <RaisedButton
          onClick={onButtonClick}
          style={buttonStyle}
          label='Add Row'
        />
      </div>
    )
  }
}
