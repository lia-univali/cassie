import React from 'react';

export default class Icon extends React.Component {
  render() {
    const { icon } = this.props;

    return (
      <div className="icon-wrapper">
        <i className="material-icons">
          {icon}
        </i>
      </div>
    );
  }
}
