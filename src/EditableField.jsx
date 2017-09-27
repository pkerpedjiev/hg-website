import React from 'react';

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      value: props.value,
      editing: false
    });
  }

  handleInputChanged(newInput) {
    this.setState({
      value: newInput
    });
  }

  handleStartEditing() {
    this.setState({editing: true})

    this.props.onEditStart();
  }

  handleEndEditing() {
    this.props.onEditEnd(this.state.value);

    this.setState({
      editing: false
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('receiving props', nextProps);

    this.setState({
      value: nextProps.value
    });
  }

  render() {
    return(
      <div
        style={{marginLeft: 20}}
      >
        { this.state.editing ? 
        <span>
          <input type={'text'} 
            onChange={evt => this.handleInputChanged(evt.target.value)}
            value={this.state.value}>
          </input>
          <button
            onClick={this.handleEndEditing.bind(this)}
          >
            {'Submit'}
          </button>
          <button
            onClick={() => this.setState({editing: false, value: this.props.value})}
          >
            {'Cancel'}
          </button>
        </span>
        :
        <span
        >
          <span>{this.state.value}</span>
          <button 
            style={{marginLeft: 20}}

            onClick={this.handleStartEditing.bind(this)} 
          >
            {'Edit'}
          </button>
        </span>
        }
      </div>
    );
  }
}
