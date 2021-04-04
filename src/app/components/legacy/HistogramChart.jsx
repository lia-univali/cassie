import React from "react";
import { BarChart, Bar, XAxis, ReferenceLine } from "recharts";

const ChartWidth = 500;

// @TODO unused component
const HistogramChart = ({ threshold, data, onChangeThreshold = () => {} }) => {
  const handleMove = (event) => {};

  const handleClick = (chartEvent, e) => {
    if (chartEvent) {
      const { bucketMeans, bucketWidth } = data;

      const first = bucketMeans[0];
      const last = bucketMeans[bucketMeans.length - 1];
      const normalized = chartEvent.chartX / ChartWidth;
      const value = (bucketWidth + (last - first)) * normalized + first;

      onChangeThreshold(value);
    }
  };

  const output = [];

  if (data) {
    data.bucketMeans.forEach((value, i) =>
      output.push({ mean: value, amount: data.histogram[i] })
    );
  }

  return (
    <div>
      <BarChart
        data={output}
        width={ChartWidth}
        height={200}
        onMouseMove={handleMove}
        onClick={handleClick}
      >
        <XAxis
          dataKey="mean"
          type="number"
          interval="preserveStartEnd"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(v) => v.toFixed(3)}
        />
        <Bar dataKey="amount" name="Frequência" fill="#CCCCCC" />
        {threshold && data && (
          <ReferenceLine
            x={threshold}
            alwaysShow
            isFront={true}
            stroke="#EF0000"
          />
        )}
      </BarChart>
    </div>
  );
};

export default HistogramChart;
