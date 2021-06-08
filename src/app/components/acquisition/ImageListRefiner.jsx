import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { useTranslation } from "react-i18next";
import ImageTable from "../visualization/ImageTable";
import StepperButtons from "./StepperButtons";
import { FINALIZE } from "../../pages/AcquisitionPage";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import TourGuider from "../tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { Tooltip } from "react-bootstrap";
import { HelpOutlineOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: "5px",
  },
  right: {
    textAlign: "right",
  },
}));
const ImageListRefiner = ({ navigate }) => {
  const metadata = useSelector((state) => state.acquisition.metadata);
  const dates = useSelector((state) => state.acquisition.availableDates);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const classes = useStyles();
  const steps = [
    {
      selector: "#column0",
      content: t("tour.acquisition.4.id"),
    },
    {
      selector: "#column1",
      content: t("tour.acquisition.4.clouds"),
    },
    {
      selector: "#column2",
      content: t("tour.acquisition.4.image"),
    },
    {
      selector: "#columnaction",
      content: t("tour.acquisition.4.action"),
    },
  ];
  const [isTourOpen, setIsTourOpen] = useLocalStorage(
    "showImageListChooserTour",
    true
  );

  const [selected, setSelected] = useState(dates.map(() => true));

  const handleChange = (index, checked) => {
    const updated = update(selected, {
      [index]: { $set: checked },
    });

    setSelected(updated);
  };

  const handleFinish = () => {
    const filtered = dates.filter((image, i) => selected[i] === true);

    dispatch(Acquisition.setAvailableDates(filtered));
  };

  useEffect(() => {
    dispatch(Acquisition.loadThumbnails());
  }, [dispatch]);

  return (
    <Box>
      <div className={classes.right}>
        <Tooltip title={t("tour.help")} aria-label="help" id="help">
          <IconButton
            aria-label="help"
            className={classes.margin}
            size="medium"
            onClick={() => {
              setIsTourOpen(true);
            }}
          >
            <HelpOutlineOutlined color="primary" fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <ImageTable
          metadata={metadata}
          images={dates}
          selected={selected}
          onCheckboxChange={handleChange}
        />

        <StepperButtons
          navigate={navigate}
          nextText={t("forms.acquisition.4.next")}
          onNext={handleFinish}
          nextTarget={FINALIZE}
        />
        <TourGuider
          steps={steps}
          isOpen={isTourOpen}
          setIsTourOpen={setIsTourOpen}
        />
      </div>
    </Box>
  );
};

export default ImageListRefiner;
