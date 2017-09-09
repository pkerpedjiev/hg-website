import React from 'react';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      value: props.value,
      editing: false
    });
  }

  render() {
    return(
      <div>
      { this.state.editing ? 
        <span>
          <input type={'text'} value={this.state.value}></input>
          <button>{'Submit'}</button>
          <button
            onClick={() => this.setState({editing: false})}
           >
            {'Cancel'}
          </button>
        </span>
        :
        <span>
          <span>{this.state.value}</span>
          <button onClick={() => this.setState({editing: true}) } >
            {'Edit'}
          </button>
        </span>
      }
      </div>
    );
  }
}
