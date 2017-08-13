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

    getCreatedValue() {
        return this.getCellValue(
            { 
                value: "Created",
                field: 'created',
                type: 'TextField',
                width: 200
            });
    }

    dateFormatter(dateStr) {
        /**
         * Format dates as in the OS X finder
         *
         * Arguments:
         * ----------
         *  dateStr: string (e.g. 2017-02-03T04:15:09.215986Z)
         *
         * Returns:
         * --------
         *
         *  A date formatted according to the local locale
         */
        if (!dateStr || dateStr.length == 0)
            return "";

        let d = new Date(Date.parse(dateStr));

        let language;
        if (window.navigator.languages) {
                language = window.navigator.languages[0];
        } else {
                language = window.navigator.userLanguage || window.navigator.language;
        }

        if (language)
            return d.toLocaleDateString(language) + " " + d.toLocaleTimeString(language)
        else
            return d.toLocaleDateString('en-US') + " " + d.toLocaleTimeString(language);
    }

  getCellValue(value, width, onChange, options) {
    const textFieldStyle = {
        width: width,
        height: 40
    }

    let editable = options && options.editable;
    let formatter = options && options.formatter;  // things that are formatted either 
                                                   // need to be reverse formatted or 
                                                   // read only

    if (!value)                 // prevent errors about null values
        value = "";

    if (formatter) {
        value = formatter(value);
    }

    const pStyle ={
                    color: '#888',
                    width: width,
                    height: 30,
                    'WebkitMarginBefore': ".3em",
                    'WebkitMarginAfter': ".3em"
                }


    if (!editable) {
        return <TextField
            id='y'
            disabled={true}
            style={textFieldStyle}
            underlineStyle={{display: 'none'}}
            value={value}
        />
    }

    let selected = this.props.row.selected;

    console.log('options.style:', options.style, Object.assign(textFieldStyle, options.style));

    if (selected) {
          return <TextField
            id="x"
            onChange={onChange}
            style={textFieldStyle}
            underlineStyle={{bottom: '2px'}}
            value={value}
          />
        } else {
          return <TextField
            id="x"
            onChange={onChange}
            inputStyle={options.style}
            style={textFieldStyle}
            disabled={true}
            underlineStyle={{display: 'none'}}
            value={value}
          />
        }
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

    columnValues['server'] = nextProps.row.server;

    this.setState({
        columnValues: columnValues
    });
  }

  render() {
    let row = this.props.row;

    const rowStyle = {
        //width: '100%',
      display: 'flex',
      flexFlow: 'row',
      flexWrap: 'wrap',
      padding: row.header ? 0 : 8,
      border: 0,
      borderBottom: '1px solid #ccc',
      justifyContent: 'spaceBetween',
      alignItems: "start",
      height: 70
    }
    const checkboxStyle = {
        marginTop: 8,
      width: 50,
      height: 24,
      alignItems: 'flex-start'
    }

    const leftCellStyle = {
        paddingRight: "5px"
    }

    const rightCellStyle = {
        paddingLeft: "5px"
    }

    const rowId = row.id
    const rowKey = ['row', rowId].join('-')
    const selected = (row && row.selected) || false

    const button = selected ? <Check /> : <ModeEdit />
    const tooltip = selected ? 'Done' : 'Edit'

    const checkbox = row.header ? <div style={checkboxStyle} />
    : <IconButton 
        onClick={this.handleRowClick.bind(this)}
        style={checkboxStyle} 
        tooltip={tooltip} 
      >
        {button}
      </IconButton>

    return (
        <div 
            style={{
            display: "flex",
            alignItems: "flex-start"
            }}
        >
        {checkbox}

      <div key={rowKey} className='row' style={rowStyle}>
        <div key={'name'} className='cell' style={leftCellStyle}>
            {this.getCellValue(
                this.state.columnValues['name'],
                540,
                x => this.setState(Object.assign(this.state.columnValue, {'name': x})),
                { editable: true, style: { color: 'black'} }
            )}
        </div>

        <div key={'created'} className='cell' style={rightCellStyle}>
            {this.getCellValue(
                this.state.columnValues['created'],
                180,
                x => this.setState(Object.assign(this.state.columnValue, {'created': x.target.value})),
                {formatter: this.dateFormatter}

            )}
        </div>

        <div key={'uuid'} className='cell' style={leftCellStyle}>
            {this.getCellValue(
                this.state.columnValues['uuid'],
                200,
                x => this.setState(Object.assign(this.state.columnValue, {'uuid': x.target.value}))
            )}
        </div>

        <div key={'server'} className='cell' style={leftCellStyle}>
            {this.getCellValue(
                this.state.columnValues['server'],
                200,
                x => this.setState(Object.assign(this.state.columnValue, {'server': x.target.value}))
            )}
        </div>

        <div key={'owner'} className='cell' style={leftCellStyle}>
            {this.getCellValue(
                this.state.columnValues['owner'],
                200,
                x => this.setState(Object.assign(this.state.columnValue, {'owner': x.target.value}))
            )}
        </div>


      </div>
    </div>
    )
  }
}
