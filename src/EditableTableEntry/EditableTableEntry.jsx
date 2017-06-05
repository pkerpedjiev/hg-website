import React from 'react';
import Check from 'material-ui/svg-icons/navigation/check';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {IconButton, Toggle, TextField, RaisedButton, DatePicker} from 'material-ui';

export default class EditableTablEntry extends React.Component {
  render() {
    let row = this.props.row;

    const self = this
    const columns = row.columns
    const rowStyle = {
      width: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: row.header ? 0 : 12,
      border: 0,
      borderBottom: '0px solid #ccc',
      height: 50
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

    const onRowClick = function (e) {
      var rows = self.state.rows
      rows.forEach((row, i) => {
        if (rowId !== i) row.selected = false
      })
      rows[rowId].selected = !rows[rowId].selected
      self.setState({rows: rows})
    }

    const r = self.state.rows[rowId]
    const selected = (r && r.selected) || false

    const button = selected ? <Check /> : <ModeEdit />
    const tooltip = selected ? 'Done' : 'Edit'

    const onClick = function (e) {
      if (selected) {
        self.update()
      }

      onRowClick(e)
    }

    const checkbox = row.header ? <div style={checkboxStyle} />
      : <IconButton style={checkboxStyle} tooltip={tooltip} onClick={onClick}>
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
