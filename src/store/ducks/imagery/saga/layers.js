import { call, put, select } from 'redux-saga/effects'
import { ee } from '../../../../services/earth-engine'

import { callback } from '../../../tools/effects'
import * as Imagery from '../header'
import { Actions as Map } from '../../map'
import { openAndWait } from '../../dialog/saga'

import { applyExpression } from '../../../../algorithms/utils'
import { cumulativeWindow, generateLayer } from '../../../../algorithms/imagery'
import { ConcreteLayer } from '../../../../common/classes'
import * as Selectors from '../../../../selectors'

export const handleLoadLayer = function* ({ payload: { layer, parent } }) {
    const { imageId, layerId } = yield select(Selectors.getImageryIdentifiers)

    if (isNaN(parent)) {
        yield put(Imagery.Actions.pushImage(parent))
        parent = imageId
    }

    let { image, params } = layer

    yield put({ type: 'EVALUATE' })
    const rawMapId = yield callback([image, image.getMap], params)
    yield put({ type: 'DONE' })

    const source = new ee.layers.EarthEngineTileSource(rawMapId)
    const overlay = new ee.layers.ImageOverlay(source)
    const concrete = new ConcreteLayer(layer, overlay)
    const position = yield select(Selectors.computeInsertionIndex(parent))

    yield put(Imagery.Actions.pushLayer(concrete, parent))
    yield put(Map.addEELayer(overlay, layerId, position))
}

export const handleToggleVisibility = function* ({ payload: { identifier } }) {
    const layer = yield select(Selectors.getLayer(identifier))

    const newVisibility = layer.visible ? 0 : 1

    yield put(Map.changeOpacity(identifier, newVisibility));
    yield put(Imagery.Actions.commitChange(identifier, { visible: newVisibility }))
}

export const handleUpdateOpacity = function* ({ payload: { identifier, opacity } }) {
    yield put(Map.changeOpacity(identifier, opacity))
    yield put(Imagery.Actions.commitChange(identifier, { opacity }))
}

export const handleRequestExpression = function* ({ payload: { parent } }) {
    const { name, expression } = yield call(openAndWait, 'newLayer')

    if (expression) {
        const { geometry, satellite } = yield select(Selectors.getAcquisitionParameters)

        const { date, missionName } = yield select(state => state.imagery.images[parent])

        const mission = satellite.get(missionName)
        const image = mission.algorithms.acquire(date, geometry)

        const target = 'band_exp'
        const modified = applyExpression(image, expression, mission.bands).rename(target)

        /* Calculate visualization parameters (min/max)
         * Issue #47 */
        const reducer = { reducer: ee.Reducer.histogram(), scale: mission.opticalResolution, geometry }
        const histogram = modified.reduceRegion(reducer).get(target)
        const window = cumulativeWindow(histogram, 0.01)
        const [min, max] = yield callback([window, window.evaluate])

        const layer = generateLayer(modified, satellite, name, { min, max })

        yield put(Imagery.Actions.loadLayer(layer, parent))
    }
}