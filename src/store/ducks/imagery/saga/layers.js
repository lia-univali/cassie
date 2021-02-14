import { put, select } from 'redux-saga/effects'
import { callback } from '../../../tools/effects'
import ee from '../../../../services/earth-engine'
import * as Imagery from '../header'
import * as Map from "../../map"
import { ConcreteLayer } from '../../../../common/classes'
import * as Selectors from '../../../../selectors'

export const handleLoadLayer = function* ({ payload: { layer, parent } }) {
    const { imageId, layerId } = yield select(Selectors.getImageryIdentifiers);

    if (isNaN(parent)) {
        yield put(Imagery.Actions.pushImage(parent));
        parent = imageId;
    }

    let { image, params } = layer;

    yield put({ type: "BEGIN_EVALUATION" });
    const rawMapId = yield callback([image, image.getMap], params);
    yield put({ type: "END_EVALUATION" });

    const source = new ee.layers.EarthEngineTileSource(rawMapId)
    const overlay = new ee.layers.ImageOverlay(source);
    const concrete = new ConcreteLayer(layer, overlay);
    const position = yield select(Selectors.computeInsertionIndex(parent));

    yield put(Imagery.Actions.pushLayer(concrete, parent));
    yield put(Map.addEELayer(overlay, layerId, position));
}

export const handleToggleVisibility = function* ({ payload: { identifier } }) {
    const layer = yield select(Selectors.getLayer(identifier));

    const newVisibility = layer.visible ? 0 : 1;

    yield put(Map.changeOpacity(identifier, newVisibility));
    yield put(Imagery.Actions.commitChange(identifier, { visible: newVisibility }));
}

export const handleUpdateOpacity = function* ({ payload: { identifier, opacity } }) {
    yield put(Map.changeOpacity(identifier, opacity));
    yield put(Imagery.Actions.commitChange(identifier, { opacity }));
}