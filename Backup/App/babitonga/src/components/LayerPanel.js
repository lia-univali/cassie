import React from 'react';
import { Panel } from 'react-bootstrap';
import DismissablePanel from './DismissablePanel';

export default class LayerPanel extends React.Component {
  render() {
    const { name, children, onRemove = () => {} } = this.props;

    return (
      <DismissablePanel big title={name} onDismiss={() => onRemove()} className="image-options">
        <div className="map-layers">
          {children}
        </div>
      </DismissablePanel>
    );
  }
}
