import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TaskButton from './TaskButton';

export default class CloseableRow extends React.Component {
  render() {
    return (
      <Row className="vcenter">
        <Col xs={10}>
          {this.props.children}
        </Col>
        <Col xs={2} className="flex-top">
          <TaskButton onClick={() => this.props.onClose()} bsSize="xsmall" className="close-button">
            x
          </TaskButton>
        </Col>
      </Row>
    );
  }
}
