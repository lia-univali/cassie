import React from 'react';

export default class Icon extends React.Component {
  render() {
    const { icon, className = "", ...rest } = this.props;
    const mergedClassName = "material-icons " + className;

    return (
      <div className="icon-wrapper">
        <i className={mergedClassName} {...rest}>
          {icon}
        </i>
      </div>
    );
  }
}
