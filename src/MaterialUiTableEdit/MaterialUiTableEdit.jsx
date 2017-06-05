const React = require('react')
const mui = require('material-ui')
const times = require('lodash.times')
const {IconButton, Toggle, TextField, RaisedButton, DatePicker} = mui

import EditableTableEntry from '../EditableTableEntry/EditableTableEntry.jsx';

module.exports = React.createClass({
  getDefaultProps: () => {
    return {
      headerColumns: [],
      rows: [],
      onChange: function () {}
    }
  },

  getInitialState: function () {
    return {
      rows: this.props.rows,
      hoverValue: false,
      currentRow: false
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  update: function () {
    const row = this.state.rows.filter((row) => {
      return row.selected
    })
    this.props.onChange(row[0])
  },

  getCellValue: function (cell) {
    const self = this
    const id = cell && cell.id
    const type = this.props.headerColumns.map((header) => {
      return header.type
    })[id]
    const selected = cell && cell.selected
    const value = cell && cell.value
    const rowId = cell && cell.rowId
    const header = cell && cell.header
    const width = cell && cell.width
    const textFieldId = [id, rowId, header, 'text'].join('-')
    const datePickerId = [id, rowId, header, 'date'].join('-')

    const textFieldStyle = {
      width: width
    }

    const datePickerStyle = {
      width: width
    }

    const onTextFieldChange = (e) => {
      const target = e.target
      const value = target.value
      var rows = self.state.rows
      rows[rowId].columns[id].value = value
      self.setState({rows: rows})
    }

    const onDatePickerChange = (e, date) => {
      var rows = self.state.rows
      rows[rowId].columns[id].value = date
      self.setState({rows: rows})
    }

    const onToggle = (e) => {
      var rows = self.state.rows
      rows[rowId].columns[id].value = !rows[rowId].columns[id].value
      self.setState({rows: rows})
    }

    if (header || (type && type === 'ReadOnly')) {
      return <p style={{color: '#888'}}>{value}</p>
    }

    if (type) {
      if (selected) {
        if (type === 'TextField') {
          return <TextField
            id={textFieldId}
            onChange={onTextFieldChange}
            style={textFieldStyle}
            value={value}
          />
        }
        if (type === 'DatePicker') {
          return <DatePicker
            id={datePickerId}
            onChange={onDatePickerChange}
            mode='landscape'
            style={datePickerStyle}
            value={value}
          />
        }
        if (type === 'Toggle') {
          return <Toggle onToggle={onToggle} toggled={value} />
        }
      } else {
        if (type === 'Toggle') {
          return <Toggle disabled onToggle={onToggle} toggled={value} />
        }
      }
    }

    return <TextField
      id={textFieldId}
      style={textFieldStyle}
      disabled
      value={value}
    />
  },

  renderHeader: function () {
    const headerColumns = this.props.headerColumns
    const columns = headerColumns.map((column, id) => {
      return {value: column.value}
    })
    const row = {columns: columns, header: true}

    return (<EditableTableEntry row={row} />);
  },


  componentWillReceiveProps: function(nextProps) {
    this.setState({rows: nextProps.rows});
  },

  render: function () {
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
            <EditableTableEntry row={row} />
        })}
        <RaisedButton
          onClick={onButtonClick}
          style={buttonStyle}
          label='Add Row'
        />
      </div>
    )
  }
})
