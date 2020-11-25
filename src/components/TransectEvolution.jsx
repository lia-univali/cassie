import React from "react";
import EvolutionChart from "./EvolutionChart";
import { fromEpoch } from "../common/utils";
import Typography from "@material-ui/core/Typography";
import { withTranslation } from 'react-i18next'

const generateRegression = (slope, intercept, x) => {
  return x.map(values => {
    return values[0] * slope + intercept;
  });
};

const formatted = (value, units = "", places = 4) => {
  if (units.length > 0) {
    units = " " + units;
  }

  return value.toFixed(places) + units;
};

const TransectEvolution = ({ t, data }) => {
  const metadata = {
    [t('forms.transectEvolution.lrr')]: formatted(data.lrr, t('forms.transectEvolution.units.mByYr')),
    [t('forms.transectEvolution.r')]: formatted(data.trend.correlation),
    [t('forms.transectEvolution.sce')]: formatted(data.sce, t('forms.transectEvolution.units.meters')),
    [t('forms.transectEvolution.nsm')]: formatted(data.nsm, t('forms.transectEvolution.units.meters')),
    [t('forms.transectEvolution.epr')]: formatted(data.epr, t('forms.transectEvolution.units.mByMonth')),
    [t('forms.transectEvolution.classification')]: data.class
  };

  const sortedValues = data.x.sort();
  const regression = generateRegression(
    data.trend.scale,
    data.trend.offset,
    sortedValues
  );

  return (
    <div>
      <EvolutionChart
        x={sortedValues.map(el =>
          fromEpoch(el[0], "days")
            .utc()
            .format()
        )}
        y={sortedValues.map(el => el[1])}
        label={t('forms.transectEvolution.labels.x')}
        yLabel={t('forms.transectEvolution.labels.y')}
        regression={regression}
      />
      <Typography style={{ marginTop: 20 }} variant="title" paragraph>
        {t('forms.transectEvolution.statistics')}
      </Typography>

      {Object.keys(metadata).map((key, i) => (
        <Typography variant="body1" key={i}>
          <b>{key}</b>: {metadata[key]}
        </Typography>
      ))}
    </div>
  );
};

export default withTranslation()(TransectEvolution);
