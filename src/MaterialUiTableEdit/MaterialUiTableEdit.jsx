const React = require('react')
import EditableTableEntry from '../EditableTableEntry/EditableTableEntry.jsx';

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

      // somebody edited a row
      if (rows[rowId].selected && this.props.onRowChange)
          this.props.onRowChange(row);

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
    const style = {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Roboto, sans-serif'
    }

    const rows = this.state.rows

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
      </div>
    )
  }
}
