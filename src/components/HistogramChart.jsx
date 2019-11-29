import React from 'react';
import { BarChart, Bar, XAxis, ReferenceLine } from 'recharts';

const ChartWidth = 500;

class HistogramChart extends React.Component {
  handleMove(event) {

  }

  handleClick(chartEvent, e) {
    if (chartEvent && this.props.onChangeThreshold) {
      const { bucketMeans, bucketWidth } = this.props.data;
      const first = bucketMeans[0];
      const last = bucketMeans[bucketMeans.length - 1];
      const normalized = chartEvent.chartX / ChartWidth;

      const value = (bucketWidth + (last - first)) * normalized + first;
      console.log(value, first, last, normalized, chartEvent);
      this.props.onChangeThreshold(value);
    }
  }

  render() {
    const { threshold } = this.props;
    const data = [];

    this.props.data.bucketMeans.forEach((value, i) => {
      data.push({mean: value, amount: this.props.data.histogram[i]});
    });

    return (
      <div>
        <div>
        </div>
        <BarChart data={data} width={ChartWidth} height={200}
          onMouseMove={e => this.handleMove(e)}
          onClick={(ce, e) => this.handleClick(ce, e)}
        >
          <XAxis dataKey="mean" type="number"
            interval="preserveStartEnd"
            domain={['dataMin', 'dataMax']}
            tickFormatter={v => v.toFixed(3)}
          />
          <Bar dataKey="amount" name="Frequência" fill="#CCCCCC"/>
          {threshold !== undefined && this.props.data &&
            <ReferenceLine x={threshold} alwaysShow
              isFront={true} stroke="#EF0000"
            />
          }
        </BarChart>
      </div>
    );
  }
}

export default HistogramChart;
