import React from 'react';

import "./EditableTableEntry.module.css";
import EditableField from "./EditableField.js";

const EditableTableEntry = props => (
  <div
    className="editable-table-entry"
  >
  {
    props.displayFields.map(field => 
      field in props.editableFields ?
      <EditableField
        key={field}
        value={props.row[field]}
        onEditStart={props.onStartRowEditing}
        onEditEnd={props.onEndRowEditing}
      /> :
      <div key={field}>{props.row[field]}</div>
    )
  }
  </div>
)

export default EditableTableEntry;
