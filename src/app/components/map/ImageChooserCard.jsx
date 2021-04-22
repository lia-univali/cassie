import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Chip, Divider } from "@material-ui/core";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import ImageChooserForm from "./ImageChooserForm";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: 0,
    marginLeft: 12,
  },
  item: {
    margin: 0,
    padding: 0,
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
}));

const ImageChooserCard = ({ className }) => {
  const availableDates = useSelector(
    (state) => state.acquisition.availableDates
  );
  const satellite = useSelector(
    (state) => state.acquisition.satellite,
    shallowEqual
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const [t] = useTranslation();

  return availableDates === undefined ? null : (
    <Card className={className} style={{ margin: 12 }}>
      <CardHeader
        title={
          <div>
            {t("forms.imageChooser.title")}
            <Chip
              className={classes.chip}
              label={`${availableDates.length} ${t(
                "forms.imageChooser.resultQuantity"
              )}`}
            />
          </div>
        }
      />

      <Divider />

      <CardContent>
        <div id="imageChooserForm">
          <ImageChooserForm
            images={availableDates}
            disabledPredicate={(i) => false}
            onLoadRequested={(i) =>
              dispatch(
                Acquisition.acquireImage(
                  availableDates[i].name,
                  availableDates[i].date
                )
              )
            }
            formatter={(i) => satellite.get(availableDates[i].name).format}
          />
        </div>
      </CardContent>

      {/* <CardActions>
        <Box flex='1'>
          <Typography variant='subtitle1'>{t('forms.imageChooser.actions.title')}</Typography>
        </Box>
        <IconButton onClick={() => setExpanded(expanded => !expanded)}>
          {expanded ? <LessIcon /> : <MoreIcon />}
        </IconButton>
      </CardActions>
      
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <ActionList name='actions' />
      </Collapse> */}
    </Card>
  );
};

export default ImageChooserCard;
