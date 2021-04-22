import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { useTranslation } from "react-i18next";
import ImageTable from "../visualization/ImageTable";
import StepperButtons from "./StepperButtons";
import { FINALIZE } from "../../pages/AcquisitionPage";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import TourGuider from "../tour/TourGuider";

const ImageListRefiner = ({ navigate }) => {
  const metadata = useSelector((state) => state.acquisition.metadata);
  const dates = useSelector((state) => state.acquisition.availableDates);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const steps = [
    {
      selector: "#column0",
      content: t("forms.acquisition.4.tour.id"),
    },
    {
      selector: "#column1",
      content: t("forms.acquisition.4.tour.clouds"),
    },
    {
      selector: "#column2",
      content: t("forms.acquisition.4.tour.image"),
    },
    {
      selector: "#columnaction",
      content: t("forms.acquisition.4.tour.action"),
    },
  ];
  const [isTourOpen, setIsTourOpen] = useState(true);

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
  );
};

export default ImageListRefiner;
