import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import {
  AddCircleOutline as Add,
  ExpandMore as ExpandIcon,
} from "@material-ui/icons";

import LayerViewer from "./LayerViewer";
import { Actions as Imagery } from "../../../store/ducks/imagery";

const useStyles = makeStyles((theme) => ({
  title: {
    wordBreak: "break-word",
  },
}));

const ImageViewer = ({ image, index }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const classes = useStyles();

  const hasLayers =
    image && image.layers && Object.keys(image.layers).length > 0;

  return (
    <Accordion defaultExpanded style={{ margin: "1px 1px" }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography className={classes.title} variant="body1">
          {image.name}
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {!hasLayers && <p>{t("forms.imageryOverlay.loading")}</p>}
          {hasLayers &&
            Object.keys(image.layers)
              .reverse()
              .map((id, i) => (
                <LayerViewer
                  key={i}
                  layer={image.layers[id]}
                  index={id}
                  parent={index}
                />
              ))}
        </Box>
      </AccordionDetails>
      <Divider />
      <Tooltip title={t("forms.imageryOverlay.hint")} placement="top">
        <IconButton onClick={() => dispatch(Imagery.requestExpression(index))}>
          <Add />
        </IconButton>
      </Tooltip>
    </Accordion>
  );
};

export default ImageViewer;
