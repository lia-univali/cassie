import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Icon from "./Icon";
import shortid from "shortid";

// @TODO unused component, has raw css
const LabeledIcon = ({ text, ...iconProps }) => {
  const [tooltipId, setTooltipId] = useState(null);

  useEffect(() => {
    setTooltipId(shortid.generate());
  }, []);

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        tooltipId && <Tooltip id={`tooltip-${tooltipId}`}>{text}</Tooltip>
      }
    >
      <span className="labeled-icon">
        <Icon {...iconProps} />
      </span>
    </OverlayTrigger>
  );
};

export default LabeledIcon;
