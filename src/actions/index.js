import { connect } from 'react-redux';
import { bindDispatch } from '../common/utils';
import * as Acquisition from '../ducks/acquisition';
import * as Imagery from '../ducks/imagery';
import * as Map from '../ducks/map';

const makeHOC = modules => (
  connect(() => ({}), bindDispatch(modules))
);

export const withAcquisition = () => makeHOC({ Acquisition });
export const withImagery = () => makeHOC({ Imagery });
export const withMap = () => makeHOC({ Map });
