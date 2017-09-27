import React from 'react';

import "./EditableTableEntry.module.css";
import EditableField from "./EditableField.jsx";

const EditableTableEntry = props => (
  <div
    style={{ display: "flex", flexDirection: "row" }}
    className="editable-table-entry"
  >
  {
    props.displayFields.map(field => 
      field in props.editableFields ?
      <div
        key={field}
      >
      <div>{field}</div>
      <EditableField
        value={props.row[field]}
        onEditStart={() => props.onStartRowEditing(props.row)}
        onEditEnd={(newValue) => {
          let newRow = JSON.parse(JSON.stringify(props.row));
          newRow.entry[field] = newValue;
          props.onEndRowEditing(newRow);
        }}
      /> 
    </div>
      :
      <div
        key={field}
      >
        <div>{field}</div>
      <div 
        style={{marginLeft: 10}}
      >{props.row[field]}</div>
    </div>
    )
  }
  <button
    onClick={() => props.onDeleteRow(props.row)}
  >
    Delete
  </button>
  </div>
)

export default EditableTableEntry;
