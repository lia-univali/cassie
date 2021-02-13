import { select, put, call } from 'redux-saga/effects'
import { chunk } from 'lodash'
import i18n from 'i18next'
import { ee } from '../../../../services/earth-engine'

import { callback } from '../../../tools/effects'
import { evaluate } from "../../../../common/sagaUtils"
import { Timer, generateColors } from "../../../../common/utils"
import { applyExpression } from "../../../../algorithms/utils"
import { pushResult } from "../../results"
import { openAndWait, openDialog } from "../../dialog"
import * as Imagery from '../header'
import * as Map from "../../map"
import * as Selectors from "../../../../selectors"
import * as Metadata from "../../../../common/metadata"
import * as Coastline from "../../../../algorithms/shoreline"
import { generateLayer } from "../../../../algorithms/imagery"

import { Actions as Snacks } from '../../snacks'

export const requestCoastlineInput = function* () {
    const dates = yield call(openAndWait, 'imageSelection')

    if (Array.isArray(dates)) {
        const { coordinates, overlay } = yield call(
            Map.requestAndWait,
            "polyline",
            i18n.t('forms.imageChooser.actions.analyzeShoreline.baselineDraw'),
            'forms.map.baseline',
            "coastlineData"
        )
    
        if (coordinates) {
            const { spacing, extent, threshold } = yield call(openAndWait, 'coastlineConfig')
    
            if (spacing) {
                const baseline = yield select(Selectors.retrieveShapeByName('forms.map.baseline'))
                baseline.content = baseline.content[0].geometry.coordinates
    
                yield put(pushResult('baselineData', { baseline }))
    
                return {
                    dates,
                    coordinates,
                    spacing: parseInt(spacing, 10),
                    extent: parseInt(extent, 10),
                    threshold: parseFloat(threshold)
                }
            }
    
            overlay.setMap(null)
        }
    }

    return null
}

const deriveInChunks = function*(dates, ...params) {
    const [ length, size ] = [ dates.length, 5 ]
    
    // @TODO improve this
    const progress = (step, etc = '') => 
        `${i18n.t('forms.shorelineAnalysis.process.extraction')} ${step}/${length} `
        + `${etc ? `[${i18n.t('forms.shorelineAnalysis.process.estimate')} ${etc}]` : ''}`

    yield put(Snacks.task('shore-ext-chunks', progress(0)))

    const evaluated = []
    const chunks = chunk(dates, size)
    
    const timer = new Timer()

    // Update snack message and progress load
    const status = () => progress(evaluated.length, timer.format(timer.project(evaluated.length, length)))
    const load = () => ({ variant: 'determinate', value: evaluated.length / length * 100 })

    for (const chunk of chunks) {
        try {
            const shorelines = yield call(Coastline.deriveShorelines, chunk, ...params)
            const job = ee.List(shorelines)
            const data = yield callback([job, job.evaluate])

            evaluated.push(...data)
        }
        catch (e) {
            // @TODO i18n
            yield put(Snacks.error(`shore-ext-chunks-err${evaluated.length}`, 
                `Error in chunk ${evaluated.length / size}. Fragment will be ignored.`))
            console.error(`[ducks/shoreline] ERROR: ${e}`)
        }
        
        yield put(Snacks.update('shore-ext-chunks', status(), load()))
    }

    yield put(Snacks.dismiss('shore-ext-chunks'))
    yield put(Snacks.success('shore-ext-success', 'Shorelines derived'))

    return ee.FeatureCollection(evaluated)
}

const performCoastlineAnalysis = function* (identifier, baseline, transects, extent, dates, threshold, names = []) {
    const { satellite } = yield select(Selectors.getAcquisitionParameters)

    const roi = baseline.buffer(extent / 2)

    const sds = yield call(deriveInChunks, dates, satellite, roi, 30, threshold, transects)
    const results = yield call(Coastline.generateTransectsStatistics, transects, baseline, sds, names)
    
    const transectsViz = yield call(Coastline.expandHorizontally, results, 10)
    const shorelines = yield call(Coastline.summaryShorelineStatistics, results, sds, roi)

    const shoreColors = generateColors(dates.length, 66)
    
    const transectLabels = yield evaluate(results.map(f => ee.Feature(f).get('label')))
    const transectColors = transectLabels.map(label => Metadata.ESTEVES_LABELS[label].color)

    yield put(Map.addEEFeature(shorelines, 'forms.map.shorelines', shoreColors, 1, identifier))
    yield put(Map.addEEFeature(transectsViz, 'forms.map.transects.title', transectColors, 1, Metadata.FeatureType.TRANSECT))

    const [transectData, shorelineData] = yield evaluate(ee.List([
        results,
        shorelines.toList(shorelines.size())
    ]))

    yield put(pushResult(identifier, { transectData, shorelineData }))
    yield put(openDialog('coastlineEvolution'))
}

export const handleAnalyzeCoastline = function* () {
    const identifier = 'coastlineData'

    yield put(Map.removeShapeGroup(identifier))

    const input = yield call(requestCoastlineInput)

    if (input) {
        const { coordinates, spacing, extent, dates, threshold } = input

        const baseline = ee.Geometry.LineString(coordinates)
        const transects = yield call(Coastline.generateOrthogonalTransects, coordinates, spacing, extent)

        yield call(performCoastlineAnalysis, identifier, baseline, transects, extent, dates, threshold)
    }
}

export const handleTestSpecificState = function* () {}

export const handleRequestExpression = function* ({ payload: { parent } }) {
    const { name, expression } = yield call(openAndWait, 'newLayer')

    if (expression) {
        const { geometry, satellite } = yield select(Selectors.getAcquisitionParameters)

        const { date, missionName } = yield select(state => state.imagery.images[parent])

        const mission = satellite.get(missionName)
        const image = mission.algorithms.acquire(date, geometry)

        const modified = applyExpression(image, expression, mission.bands)
        const layer = generateLayer(modified, satellite, name, {})

        yield put(Imagery.Actions.loadLayer(layer, parent))
    }
}