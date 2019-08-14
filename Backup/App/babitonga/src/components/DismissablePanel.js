import React from 'react';
import { Panel } from 'react-bootstrap';
import CloseableRow from './CloseableRow';

export default class DismissablePanel extends React.Component {
  render() {
    let headerClass = "d-panel-title";
    if (this.props.big) {
      headerClass += " big-title";
    }

    const header = (
      <CloseableRow onClose={() => this.props.onDismiss()}>
        <span className={headerClass}>{this.props.title}</span>
      </CloseableRow>
    );

    return (
      <Panel header={header}>
        {this.props.children}
      </Panel>
    );
  };
}
