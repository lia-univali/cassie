import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Box, CircularProgress } from "@material-ui/core";

const SatelliteThumbnail = ({ url, height }) => {
  return (
    <Box display="flex" alignItems="center" height={height}>
      {url && (
        <Zoom zoomMargin={50} overlayBgColorStart={'rgba(255, 255, 255, 0)'} overlayBgColorEnd={'rgba(255, 255, 255, 0.5)'}>
          <img
            src={url}
            alt="Satellite Thumbnail"
            style={{ maxHeight: height }}
          />
        </Zoom>
      )}
      {!url && <CircularProgress />}
    </Box>
  );
};

export default SatelliteThumbnail;
