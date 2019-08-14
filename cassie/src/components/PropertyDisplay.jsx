import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const PropertyDisplay = ({name, value, icon, ...rest}) => {
  rest.placement = rest.placement || "bottom";

  return (
    <div className="flex vcenter">
      <Tooltip {...rest} title={name}>
        {icon}
      </Tooltip>
      <Typography variant="body1">{" " + value}</Typography>
    </div>
  );
}

export default PropertyDisplay;
