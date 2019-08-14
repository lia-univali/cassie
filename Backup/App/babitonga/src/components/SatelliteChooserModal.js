import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import SatelliteChoice from './SatelliteChoice';
import { closeModal, clearParams } from '../actions/modalActions';
import { getAll, get } from '../spacecrafts';

class SatelliteChooserModal extends React.Component {
  createChoices() {
    const spacecrafts = getAll();
    const colWidth = spacecrafts.length < 3 ? 6 : 4;

    return spacecrafts.map((satellite, i) => (
      <Col xs={colWidth} key={i}>
        <SatelliteChoice spacecraft={satellite}
          disabled={i === this.props.spacecraftIndex}
          onChoose={() => this.props.callback(i)}/>
      </Col>
    ));
  }

  render() {
    const { shown, closeModal, clearParams } = this.props;

    const sizeObject = {};
    if (getAll().length >= 3) {
      sizeObject.bsSize = "large";
    }

    return (
      <Modal {...sizeObject} show={shown} onHide={() => closeModal()} onExited={() => clearParams()}>
        <Modal.Header closeButton>
          <Modal.Title>Escolha um satélite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {this.createChoices()}
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

const stateMapper = (state) => {
  const { modal, data } = state;
  return {...modal, spacecraftIndex: data.spacecraftIndex};
}

export default connect(stateMapper, {closeModal, clearParams})(SatelliteChooserModal);
