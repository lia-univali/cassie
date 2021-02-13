import React from 'react';
import { Line } from 'react-chartjs-2';

const EvolutionChart = ({ width = 500, height = 300, regression = [], x = [], y = [],
                          xLabel = 'x', yLabel = 'y', trendLabel = 'trend'}) => {
  const createData = () => {
    return {
      labels: x,
      datasets: [
        {
          pointRadius: 5,
          lineTension: 0,
          borderColor: "#009688",
          backgroundColor: "#009688",
          fill: false,
          data: y,
          label: yLabel,
        }, {
          pointRadius: 0,
          lineTension: 0,
          borderColor: "#0d88c5",
          backgroundColor: "#0d88c5",
          borderWidth: 1.5,
          fill: false,
          borderDash: [10, 10],
          data: regression,
          label: trendLabel,
        }
      ]
    };
  }

  const createOptions = () => {
    return {
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: "year",
            round: false,
            tooltipFormat: "DD/MM/YYYY"
          },
          scaleLabel: {
            labelString: xLabel,
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yLabel,
          }
        }]
      }
    }
  }

  return (
    <div>
      <Line data={createData()} options={createOptions()} width={width} height={height} />
    </div>
  )
}

export default EvolutionChart
