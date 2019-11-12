import React from 'react';
import { Line } from 'react-chartjs-2';
import { fromEpoch } from '../common/utils';
import { FeatureType } from '../common/metadata';

class EvolutionChart extends React.Component {
  createData() {
    const {
      regression,
      x = [],
      y = [],
      label = "Valor",
    } = this.props;

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
          label,
        }, {
          pointRadius: 0,
          lineTension: 0,
          borderColor: "#0d88c5",
          backgroundColor: "#0d88c5",
          borderWidth: 1.5,
          fill: false,
          borderDash: [10, 10],
          data: regression,
          label: "Tendência",
        }
      ]
    };
  }

  createOptions() {
    const { xLabel, yLabel } = this.props;

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

  render() {
    const { width = 600, height = 400 } = this.props;

    return (
      <div>
        <Line data={this.createData()} options={this.createOptions()} width={width} height={height} />
      </div>
    );
  }
}

export default EvolutionChart;
