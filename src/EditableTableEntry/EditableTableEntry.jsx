import React from 'react';
import Check from 'material-ui/svg-icons/navigation/check';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {IconButton, Toggle, TextField, DatePicker} from 'material-ui';

export default class EditableTableEntry extends React.Component {
  getCellValue(cell) {
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
      var rows = this.state.rows
      rows[rowId].columns[id].value = value
      this.setState({rows: rows})
    }

    const onDatePickerChange = (e, date) => {
      var rows = this.state.rows
      rows[rowId].columns[id].value = date
      this.setState({rows: rows})
    }

    const onToggle = (e) => {
      var rows = this.state.rows
      rows[rowId].columns[id].value = !rows[rowId].columns[id].value
      this.setState({rows: rows})
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
  }

  render() {
    let row = this.props.row;

    const columns = row.columns
    const rowStyle = {
        //width: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: row.header ? 0 : 8,
      border: 0,
      borderBottom: '0px solid #ccc',
      height: 30
    }
    const checkboxStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 24,
      alignItems: 'center'
    }

    const rowId = row.id
    const rowKey = ['row', rowId].join('-')

    const selected = (row && row.selected) || false

    const button = selected ? <Check /> : <ModeEdit />
    const tooltip = selected ? 'Done' : 'Edit'

    const checkbox = row.header ? <div style={checkboxStyle} />
    : <IconButton 
        onClick={this.props.onRowClick}
        style={checkboxStyle} 
        tooltip={tooltip} 
      >
        {button}
      </IconButton>

    return (
      <div key={rowKey} className='row' style={rowStyle}>
        {checkbox}
        {columns.map((column, id) => {
          const width = this.props.headerColumns.map((header) => {
            return (header && header.width) || false
          })[id]
          const cellStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            flexGrow: 0.15,
            flexBasis: 'content',
            alignItems: 'center',
            padding: '5px',
            height: 30,
            width: width || 200
          }
          const columnKey = ['column', id].join('-')
          column.selected = selected
          column.rowId = rowId
          column.id = id
          column.header = row.header
          column.width = cellStyle.width
          return (
            <div key={columnKey} className='cell' style={cellStyle}>
              <div>
                {this.getCellValue(column)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
