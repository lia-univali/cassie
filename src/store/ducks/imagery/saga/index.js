import { all, takeEvery, takeLeading } from 'redux-saga/effects'
import { Types } from '../header'
import * as Layers from './layers'
import * as Shoreline from './shoreline'

const root = function* () {
    yield all([
        takeLeading(Types.LOAD_LAYER, Layers.handleLoadLayer),
        takeEvery(Types.TOGGLE_VISIBILITY, Layers.handleToggleVisibility),
        takeEvery(Types.UPDATE_OPACITY, Layers.handleUpdateOpacity),
        takeLeading(Types.ANALYZE_COASTLINE, Shoreline.handleAnalyzeCoastline),
        takeLeading(Types.REQUEST_EXPRESSION, Shoreline.handleRequestExpression),
    ]);
}

export default root