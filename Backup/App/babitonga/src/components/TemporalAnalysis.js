import React from 'react';
import { connect } from 'react-redux';
import { SplitButton } from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import moment from 'moment';
import { generateAreaChart, clearVegetationData } from '../actions';
import { openModal } from '../actions/modalActions';
import TaskButton from './TaskButton';
import TaskMenuItem from './TaskMenuItem';

class TemporalAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {begin: 0, end: 0};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timeInfo) {
      this.setState({
        begin: 0,
        end: nextProps.timeInfo.diff
      });
    }
  }

  createRangeSlider() {
    const { satelliteData, timeInfo } = this.props;

    const TooltipRange = Slider.createSliderWithTooltip(Range);
    return (
      <TooltipRange
        min={0} max={timeInfo.diff} defaultValue={[this.state.begin, this.state.end]}
        tipFormatter={val => moment(timeInfo.start).add(val, "days").format("L")}
        onAfterChange={val => this.setState({begin: val[0], end: val[1]})}
      />
    );
  }

  generateChart() {
    this.props.generateAreaChart(this.state.begin, this.state.end);
  }

  reopenChart() {
    this.props.openModal("VEGETATION_AREA", this.props.vegetationData);
  }

  createGenerateButton() {
    const { vegetationData, clearVegetationData } = this.props;

    if (vegetationData) {
      return (
        <SplitButton title="Reabrir gráfico" onClick={() => this.reopenChart()} id="chart-dd">
          <TaskMenuItem onSelect={() => clearVegetationData()}>
            Limpar dados
          </TaskMenuItem>
        </SplitButton>
      );
    } else {
      return (
        <TaskButton onClick={() => this.generateChart()}>Gerar gráfico</TaskButton>
      );
    }
  }

  render() {
    return (
      <div className="vcenter">
        {this.createRangeSlider()}
        {this.createGenerateButton()}
      </div>
    );
  }
}

export default connect(state => {
  return {...state.data};
}, {generateAreaChart, clearVegetationData, openModal})(TemporalAnalysis);
