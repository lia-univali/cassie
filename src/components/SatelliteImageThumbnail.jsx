import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'

const SatelliteThumbnail = ({url, height}) => {
  const renderContent = () => {
    if (url === undefined) {
      return <CircularProgress/>
    } else {
      return (
        <a href={url}>
          <img src={url} style={{maxHeight: height}}/>
        </a>
      );
    }
  }

  return (
    <div style={{height: height, display: "flex", alignItems: "center"}}>
      {renderContent()}
    </div>
  );
};

export default SatelliteThumbnail;
