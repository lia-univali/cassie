import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Icon from './Icon';
import shortid from 'shortid';

export default class LabeledIcon extends React.Component {
  constructor(props) {
    super(props);

    this.tooltipId = shortid.generate();
  }

  render() {
    const { text, ...iconProps } = this.props;
    const CustomTooltip = (
      <Tooltip id={"tooltip-" + this.tooltipId}>{text}</Tooltip>
    );

    return (
      <OverlayTrigger placement="top" overlay={CustomTooltip}>
        <span className="labeled-icon"><Icon {...iconProps}/></span>
      </OverlayTrigger>
    );
  }
}
