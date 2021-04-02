import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

// @TODO unused component
const PropertyDisplay = ({ name, value, icon, ...rest }) => {
  rest.placement = rest.placement || "bottom";

  return (
    // @TODO has raw css
    <div className="flex vcenter">
      <Tooltip {...rest} title={name}>
        {icon}
      </Tooltip>
      <Typography variant="body1">{" " + value}</Typography>
    </div>
  );
};

export default PropertyDisplay;
