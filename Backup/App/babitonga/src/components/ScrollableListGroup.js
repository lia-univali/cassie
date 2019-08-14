import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ListGroup } from 'react-bootstrap';

export default class ScrollableListGroup extends React.Component {
  render() {
    const { children, maxHeight, ...rest } = this.props;

    const dummy = <div style={{width: 0, height: 0}}></div>;

    return (
      <div className="scrollable-list-wrapper">
        <Scrollbars autoHide autoHeight autoHeightMax={maxHeight}
          renderTrackHorizontal={() => dummy}
          renderThumbHorizontal={() => dummy}
        >
          <ListGroup {...rest} className="scrollable-list">
            {children}
          </ListGroup>
        </Scrollbars>
      </div>
    )
  }
}
