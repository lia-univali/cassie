import React from 'react';
import Spinner from 'react-spinkit';

export default class BusyPanel extends React.Component {
  render() {
    const rootClass = "busy-panel " + (this.props.shown ? "opaque" : "transparent");

    return (
      <div className={rootClass}>
        <div className="spinner-wrapper">
          <Spinner name="ball-scale-multiple" color="#CCCCCC"/>
        </div>
        {this.props.message &&
          <div>
            <h5 className="busy-message">{this.props.message}...</h5>
          </div>
        }
      </div>
    );
  }
}
