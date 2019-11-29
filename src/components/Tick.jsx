import React from 'react';
import Divider from '@material-ui/core/Divider';

const Tick = ({height, ...props}) => {
  const style = {
    height: height,
    width: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  return (
    <Divider style={style} {...props}/>
  );
};

export default Tick;
