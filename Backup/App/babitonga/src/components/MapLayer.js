import React from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Row, Col, DropdownButton } from 'react-bootstrap';
import { openModal, closeModal } from '../actions/modalActions';
import { updateThreshold, updateVisibility, updateOpacity, clearThreshold } from '../actions';
import TaskMenuItem from './TaskMenuItem';

class MapLayer extends React.Component {
  handleThreshold() {
    const { openModal, closeModal, updateThreshold, index } = this.props;

    openModal("THRESHOLD", {index}, result => {
      updateThreshold(index, result.index);
      closeModal();
    });
  }

  createTitle() {
    const { title, threshold } = this.props.layers[this.props.index];

    if (threshold !== undefined) {
      return <h4>{title} <i>(T = {threshold.toFixed(3)})</i></h4>;
    }

    return <h4>{title}</h4>;
  }

  render() {
    const { layers, index, updateThreshold, updateVisibility, updateOpacity, clearThreshold } = this.props;

    const { title, visible, opacity, threshold, thresholdedImage } = layers[index];

    return (
      <div className="slider-container">
        <Row className="vcenter layer-title-wrapper">
          <Col xs={8}>
            {this.createTitle()}
          </Col>
          <Col xs={2} className="nohmargin text-right">
            <input
              style={{display: "inline"}}
              type="checkbox"
              checked={visible}
              onChange={() => updateVisibility(index, !visible)}
            />
          </Col>
          <Col xs={2}>
            <DropdownButton title="" id={"mlayer" + index} bsSize="xsmall" pullRight>
              <TaskMenuItem onClick={() => this.handleThreshold()}>Limiarizar</TaskMenuItem>
              <TaskMenuItem onClick={() => clearThreshold(index)} disabled={thresholdedImage === undefined}>
                Remover limiarização
              </TaskMenuItem>
            </DropdownButton>
          </Col>
        </Row>
        <div className="slider">
          <input
            type="range"
            min={0}
            max={100}
            value={opacity * 100.0}
            onChange={v => updateOpacity(index, v.target.value / 100.0)}
          />
        </div>
      </div>
    )
  }
}

const stateMapper = (state, ownProps) => {
  const { layers } = state.data;
  return {...ownProps, layers};
}

export default connect(stateMapper, {
  updateThreshold, updateVisibility, updateOpacity, clearThreshold, openModal, closeModal
})(MapLayer);
