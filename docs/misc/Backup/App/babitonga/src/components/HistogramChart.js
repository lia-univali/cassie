import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

class HistogramChart extends React.Component {
  handleMove(event) {

  }

  handleClick(event) {
    console.log(event);
    if (event && this.props.onChangeThreshold) {
      this.props.onChangeThreshold(event.activeTooltipIndex);
    }
  }

  render() {
    const { threshold, places = 3 } = this.props;
    const data = [];

    this.props.data.bucketMeans.forEach((value, i) => {
      data.push({mean: value, amount: this.props.data.histogram[i]});
    });

    return (
      <div>
        <div>
        </div>
        <BarChart data={data} width={500} height={200}
          onMouseMove={e => this.handleMove(e)}
          onClick={e => this.handleClick(e)}
        >
          <XAxis dataKey="mean" ref={(v) => console.log(v)}/>
          <Bar dataKey="amount" name="Frequência" fill="#CCCCCC"/>
          {threshold !== undefined && this.props.data && 
            <ReferenceLine x={this.props.data.bucketMeans[threshold]}
              isFront={true} stroke="#EF0000"
            />
          }
        </BarChart>
      </div>
    );
  }
}

export default HistogramChart;
