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
import { Box } from "@material-ui/core";
import HelpButton from "../core/HelpButton";

// This is the page of the fourth step of the aquisition wizard
// it is supposed to display all the images at range, and let the user
// choose which images to acquire.
const ImageListRefiner = ({ navigate }) => {
  
  const metadata = useSelector((state) => state.acquisition.metadata);
  const dates = useSelector((state) => state.acquisition.availableDates);

  const dispatch = useDispatch();
  // get the current language from the store
  const [t] = useTranslation();
  // defines the steps for the tour
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
  // the initial state of the tour
  const [isTourOpen, setIsTourOpen] = useLocalStorage(
    "showImageListChooserTour",
    true
  );
  
  // the initial state of the of each image of the table
  const [selected, setSelected] = useState(dates.map(() => true));
  
  // the action to perform when the user clicks in one checkbox
  const handleChange = (index, checked) => {
    // set the state of the checkbox for the index
    const updated = update(selected, {
      [index]: { $set: checked },
    });
    // dispatch the action to update the state of the application
    setSelected(updated);
  };

  // the action to perform when the user clicks in the finalize button
  const handleFinish = () => {
    const filtered = dates.filter((image, i) => selected[i] === true);
    dispatch(Acquisition.setAvailableDates(filtered));
  };

  useEffect(() => {
    dispatch(Acquisition.loadThumbnails());
  }, [dispatch]);

  return (
    <Box>
      <HelpButton
        onClickFunction={() => {
          setIsTourOpen(true);
        }}
      />
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
