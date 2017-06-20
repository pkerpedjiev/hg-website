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

    const checkboxStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 24,
      alignItems: 'center'
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
                    console.log('header:', header);

                    let cellStyle = {
                      display: 'flex',
                      flexFlow: 'row nowrap',
                      flexGrow: 0.15,
                      flexBasis: 'content',
                      alignItems: 'center',
                      padding: '5px',
                      height: 30,
                      width: width || 200
                    }

                    console.log('this.props.sortBy:', this.props.sortBy);
                    if (this.props.sortBy == header.field)
                        cellStyle.background = "#aaa";

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
      alignItems: 'center',
      fontFamily: 'Roboto, sans-serif'
    }

    const rows = this.state.rows
    console.log('rendering...');

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
