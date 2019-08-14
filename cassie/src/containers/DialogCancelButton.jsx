import React from 'react';
import { connect } from 'react-redux';
import * as Modal from 'actions/modal';
import Button from 'components/Button';
import { bindDispatch } from 'common/utils';

const DialogCancelButton = ({title, modal, ...rest}) => (
  <Button color="default" onClick={() => modal.close()} {...rest}>
    {title}
  </Button>
)

export default connect(() => ({}), bindDispatch({Modal}))(DialogCancelButton);
