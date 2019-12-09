import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { loadImage, selectImage } from '../actions';
import { closeModal, clearParams } from '../actions/modalActions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import moment from 'moment';
import { formatArea } from '../utils';

const RotatedTick = ({x, y, payload, rotation, formatter = (a) => (a)}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={20} textAnchor="end" fill="#666" transform={`rotate(${rotation})`}>
        {formatter(payload.value)}
      </text>
    </g>
  );
};

class AreaSeriesModal extends React.Component {
  format(date) {
    return moment(date).format("L");
  }

  handleClick(e) {
    const { params, closeModal, loadImage, data } = this.props;
    const element = params.data[e.activeTooltipIndex];

    closeModal();
    const i = data.satelliteData.features.findIndex(v => v.properties["system:index"] === element.id);
    selectImage(i);
    loadImage(i);
  }

  render() {
    const { shown, closeModal, clearParams, data, params = {}, callback = () => {} } = this.props;

    if (!params.data) {
      return null;
    }

    const margins = {top: 20, bottom: 50, left: 20, right: 20};

    const areas = params.data.map(el => el.area);
    const minArea = Math.min(...areas);
    const maxArea = Math.max(...areas);
    const areaRange = maxArea - minArea;
    const areaBreadth = areaRange * 2;

    return (
      <Modal bsSize="large" show={shown} onHide={() => closeModal()} onExited={() => clearParams()}>
        <Modal.Header closeButton>
          <Modal.Title>Evolução da área de vegetação</Modal.Title>
        </Modal.Header>
        <Modal.Body className="hcenter">
          <ResponsiveContainer width="90%" height={400}>
            <LineChart data={params.data} margin={margins} onClick={e => this.handleClick(e)}>
              <XAxis dataKey="date" type="number"
                domain={["dataMin", "dataMax"]}
                tick={<RotatedTick rotation={-35} formatter={this.format}/>}
                interval={"preserveStartEnd"}
                tickCount={8}
              />
              <YAxis yAxisId="area" tickFormatter={label => formatArea(label)}
                //domain={[minArea - areaBreadth, maxArea + areaBreadth]}
                // interval={0}
                // tickCount={6}
              />
              <YAxis yAxisId="blue" orientation="right"/>
              <Line yAxisId="area" dataKey="area" name="Área" stroke="#67e03d"
                dot={{r: 1.2}} activeDot={{r: 4}}
              />
              <Line yAxisId="blue" dataKey="blue" name="Banda azul" stroke="#3aaef9"
                dot={{r: 1.2}} activeDot={{r: 4}}
              />
              <Tooltip
                labelFormatter={label => this.format(label)}
                formatter={value => formatArea(value)}
              />
              <Legend wrapperStyle={{bottom: 0}}/>
            </LineChart>
          </ResponsiveContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => closeModal()}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const stateMapper = (state) => {
  const { modal, data } = state;
  return { ...modal, data};
};

export default connect(stateMapper, {
  closeModal, clearParams, loadImage, selectImage
})(AreaSeriesModal);
