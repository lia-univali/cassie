import React from "react";
import EvolutionChart from "./EvolutionChart";
import { fromEpoch } from "../common/utils";
import Typography from "@material-ui/core/Typography";

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

const TransectEvolution = ({ data }) => {
  const metadata = {
    "Taxa de alteração (LRR)": formatted(data.lrr, "m/ano"),
    "Coeficiente de correlação (r)": formatted(data.trend.correlation),
    "SCE": formatted(data.sce, "m"),
    "NSM": formatted(data.nsm, "m"),
    "EPR": formatted(data.epr, "m/mês"),
    "Classe": data.class
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
        label="Distância"
        yLabel="metros"
        regression={regression}
      />
      <Typography style={{ marginTop: 20 }} variant="title" paragraph>
        Estatísticas
      </Typography>

      {Object.keys(metadata).map((key, i) => (
        <Typography variant="body1" key={i}>
          <b>{key}</b>: {metadata[key]}
        </Typography>
      ))}
    </div>
  );
};

export default TransectEvolution;
