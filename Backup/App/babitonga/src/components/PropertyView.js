import React from 'react';
import LabeledIcon from './LabeledIcon';

export default class PropertyView extends React.Component {
  render() {
    const { icon, attribute, value, ...rest } = this.props;

    return (
      <div className="property-view">
        <LabeledIcon icon={icon} text={attribute} {...rest}/>
        <span className="property-view-value">{value}</span>
      </div>
    );
  }
}
