import React from 'react';
import Check from 'material-ui/svg-icons/navigation/check';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {IconButton, Toggle, TextField, DatePicker} from 'material-ui';

export default class EditableTableEntry extends React.Component {
    constructor(props) {
        super(props);

        let columnValues = {};

        for (let column of this.props.headerColumns) {
            columnValues[column.field] = this.props.row.entry[column.field];
        }

        this.state = {
            columnValues : columnValues
        }
    }

  getCellValue(column) {
    const type = column.type;
    const value = this.state.columnValues[column.field];
    const textFieldId = column.field;
    const datePickerId = column.field;

    const textFieldStyle = {
      width: column.width
    }

    const datePickerStyle = {
      width: column.width
    }

    const onTextFieldChange = (e) => {
        /*
      const target = e.target
      const value = target.value
      var rows = this.state.rows
      rows[rowId].columns[id].value = value
      this.setState({rows: rows})
      */
        let columnValues = this.state.columnValues;
        columnValues[column.field] = e.target.value;

        this.setState({ columnValues: columnValues});
    }

    const onDatePickerChange = (e, date) => {
        /*
      var rows = this.state.rows
      rows[rowId].columns[id].value = date
      this.setState({rows: rows})
      */
    }

    const onToggle = (e) => {
        /*
      var rows = this.state.rows
      rows[rowId].columns[id].value = !rows[rowId].columns[id].value
      this.setState({rows: rows})
      */
    }

    if (this.props.row.entry.header || (type && type === 'ReadOnly')) {
      return <p style={{color: '#888'}}>{value}</p>
    }

    let selected = this.props.row.selected;

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

  handleRowClick(e) {
      /**
       * A row has changed, update its value and call the parent
       * handler.
       */
      let newRow = JSON.parse(JSON.stringify(this.props.row));

      for (let column of this.props.headerColumns) {
        newRow.entry[column.field] = this.state.columnValues[column.field];
      }

      this.props.onRowClick(newRow);
  }

  componentWillReceiveProps(nextProps) {
      let columnValues = this.state.columnValues;
    for (let column of nextProps.headerColumns) {
        columnValues[column.field] = nextProps.row.entry[column.field];
    }

    this.setState({
        columnValues: columnValues
    });
  }

  render() {
    let row = this.props.row;

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

    console.log('row:', this.props.row);

    const checkbox = row.header ? <div style={checkboxStyle} />
    : <IconButton 
        onClick={this.handleRowClick.bind(this)}
        style={checkboxStyle} 
        tooltip={tooltip} 
      >
        {button}
      </IconButton>

    return (
      <div key={rowKey} className='row' style={rowStyle}>
        {checkbox}
        {this.props.headerColumns.map((column) => {
              const cellStyle = {
                display: 'flex',
                flexFlow: 'row nowrap',
                flexGrow: 0.15,
                flexBasis: 'content',
                alignItems: 'center',
                padding: '5px',
                height: 30,
                width: column.width || 200
              }

          const columnKey = column.field;

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
