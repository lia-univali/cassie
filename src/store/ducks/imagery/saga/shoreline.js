import { select, put, call } from 'redux-saga/effects'
import { chunk } from 'lodash'
import i18next from 'i18next'
import ee from '../../../../services/earth-engine'
import { callback } from '../../../tools/effects'
import { evaluate } from "../../../../common/sagaUtils";
import { generateColors } from "../../../../common/utils";
import { applyExpression } from "../../../../common/eeUtils";
import { pushResult } from "../../results";
import { openAndWait, openDialog } from "../../dialog";
import * as Imagery from '../header'
import * as Map from "../../map";
import * as Selectors from "../../../../selectors";
import * as Metadata from "../../../../common/metadata";
import * as Coastline from "../../../../algorithms/coastline";
import { generateLayer } from "../../../../algorithms/imagery";

import { Actions as Snacks } from '../../snacks'

export const requestCoastlineInput = function* () {
    const dates = yield* openAndWait("imageSelection");

    if (!Array.isArray(dates)) {
        return null;
    }

    const { coordinates, overlay } = yield* Map.requestAndWait(
        "polyline",
        i18next.t('forms.imageChooser.actions.analyzeShoreline.baselineDraw'),
        'forms.map.baseline',
        "coastlineData"
    );

    if (coordinates === undefined) {
        return null;
    }

    const { spacing, extent, threshold } = yield* openAndWait("coastlineConfig");

    if (spacing === undefined) {
        overlay.setMap(null);
        return null;
    }

    const baseline = yield select(Selectors.retrieveShapeByName('forms.map.baseline'));
    baseline.content = baseline.content[0].geometry.coordinates;

    yield put(pushResult("baselineData", { baseline }));

    return {
        dates,
        coordinates,
        spacing: parseInt(spacing, 10),
        extent: parseInt(extent, 10),
        threshold: parseFloat(threshold)
    };
}

const estevesLabelling = (transects) => {
    const labels = ee.Dictionary({
        stable: ee.Dictionary({ class: 'Stable', color: '#43a047' }),
        accreted: ee.Dictionary({ class: 'Accreted', color: '#1976d2' }),
        eroded: ee.Dictionary({ class: 'Eroded', color: '#ffa000' }),
        criticallyEroded: ee.Dictionary({ class: 'Critically Eroded', color: '#d32f2f' })
    })

    const classified = transects.map(f => {
        const lrr = ee.Number(ee.Feature(f).get('lrr'))

        const classification =
            ee.Algorithms.If(lrr.lt(-1.0), labels.get('criticallyEroded'),
                ee.Algorithms.If(lrr.lt(-0.5), labels.get('eroded'),
                    ee.Algorithms.If(lrr.lt(0.5), labels.get('stable'), labels.get('accreted'))))

        return ee.Feature(f).set(classification)
    })

    return classified;
}

const performCoastlineAnalysis = function* (identifier, baseline, transects, extent, dates, threshold, names = []) {
    const { satellite } = yield select(
        Selectors.getAcquisitionParameters
    );

    const bufferedBaseline = baseline.buffer(extent / 2);

    const asAsync = job => (...params) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(job.apply(job, [...params]))
            }, 0)
        })
    }

    const shorelines = yield call(
        asAsync(Coastline.deriveShorelines),
        dates,
        satellite,
        bufferedBaseline,
        threshold,
        transects
    );

    yield put(Snacks.task('shoreline-ext-chunks', 'Extracting shorelines'))

    const shorelineChunks = chunk(shorelines, 5)
    let i = 0, collector = []

    for (const chunk of shorelineChunks) {
        console.log(`Acquiring ${i++}`)

        const job = ee.List(chunk)
        const data = yield callback([job, job.evaluate])

        collector = collector.concat(data)
    }

    const sds = ee.FeatureCollection(collector)

    yield put(Snacks.dismiss('shoreline-ext-chunks'))

    transects = yield call(Coastline.generateTransectsStatistics, transects, baseline, sds, names);

    const classified = yield call(estevesLabelling, transects);

    const transectsViz = yield call(Coastline.expandHorizontally, classified, 10);

    const enhancedCoastlines = yield call(
        Coastline.mapToSummary,
        classified,
        sds,
        bufferedBaseline
    );

    const lrrColors = yield evaluate(classified.map(f => ee.Feature(f).get('color')))

    const colors = generateColors(dates.length, 66);
    yield put(
        Map.addEEFeature(
            enhancedCoastlines,
            'forms.map.shorelines',
            colors,
            1,
            identifier
        )
    );
    yield put(
        Map.addEEFeature(
            transectsViz,
            'forms.map.transects.title',
            lrrColors,
            1,
            Metadata.FeatureType.TRANSECT
        )
    );

    const finalQuery = ee
        .List(enhancedCoastlines.toList(enhancedCoastlines.size()))
        .map(poly => {
            return ee.Feature(poly).toDictionary(["date", "mean", "stdDev"]);
        });

    const coastlineCollection = yield evaluate(enhancedCoastlines);

    const [evolutionData, transectData] = yield evaluate(
        ee.List([finalQuery, classified])
    );

    const withColors = evolutionData.map((row, i) => ({
        ...row,
        color: colors[i]
    }));

    const putObjectId = feature => {
        return ee
            .Feature(feature)
            .set("objectid", ee.Feature(feature).get("system:index"));
    };

    const selectProperties = (properties) => feature => {
        const props = ee.List(properties);
        const cast = ee.Feature(feature);
        return ee.Feature(cast.geometry(), cast.toDictionary(props));
    };

    const shapeTransectData = feature => {
        const cast = ee.Feature(feature);
        const geometry = ee.Geometry(cast.geometry());
        let properties = cast.toDictionary();

        // insert initial and final coordinates
        const begin = ee.List(geometry.coordinates().get(0));
        properties = properties.set("LongStart", ee.Number(begin.get(0)));
        properties = properties.set("LatStart", ee.Number(begin.get(1)));

        const end = ee.List(geometry.coordinates().get(1));
        properties = properties.set("LongEnd", ee.Number(end.get(0)));
        properties = properties.set("LatEnd", ee.Number(end.get(1)));

        // set regression values
        const trend = ee.Dictionary(properties.get("trend"));
        const r = ee.Number(trend.get("correlation"));

        properties = properties.set("r", r);
        properties = properties.set("rsquared", r.pow(2));
        properties = properties.set("intercept", trend.get("offset"));
        properties = properties.set("slope", trend.get("scale"));

        return ee.Feature(geometry, properties);
    };

    const exportable = {
        shpBaseline: yield evaluate(
            ee
                .FeatureCollection([baseline])
                .map(putObjectId)
        ),
        shpCoasts: yield evaluate(
            ee
                .FeatureCollection(enhancedCoastlines)
                .map(selectProperties(["date", "mean", "stdDev"]))
                .map(putObjectId)
        ),
        shpTransects: yield evaluate(
            ee
                .FeatureCollection(classified)
                .map(shapeTransectData)
                .map(
                    selectProperties(
                        [
                            "LongStart",
                            "LongEnd",
                            "LatStart",
                            "LatEnd",
                            "r",
                            "rsquared",
                            "intercept",
                            "slope",
                            "epr",
                            "lrr",
                            "nsm",
                            "sce",
                            "class",
                            ...names
                        ]
                    )
                )
                .map(putObjectId)
        )
    };

    yield put(
        pushResult(identifier, {
            transectData,
            coastlineCollection,
            evolution: withColors,
            exportable
        })
    );

    yield put(openDialog("coastlineEvolution"));
}

export const handleAnalyzeCoastline = function* () {
    const identifier = "coastlineData";

    yield put(Map.removeShapeGroup(identifier));

    const input = yield* requestCoastlineInput();
    if (input === null) return;

    const { coordinates, spacing, extent, dates, threshold } = input;

    const baseline = ee.Geometry.LineString(coordinates);

    const transects = yield call(
        Coastline.generateOrthogonalTransects,
        coordinates,
        spacing,
        extent
    );

    yield* performCoastlineAnalysis(identifier, baseline, transects, extent, dates, threshold === -1 ? 0 : threshold);
}

export const handleTestSpecificState = function* () {
    // Reserved
}

export const handleRequestExpression = function* ({ payload: { parent } }) {
    const { name, expression } = yield* openAndWait("newLayer")

    if (expression !== undefined) {
        const { geometry, satellite } = yield select(
            Selectors.getAcquisitionParameters
        )

        const { date, missionName } = yield select(state => state.imagery.images[parent])

        const mission = satellite.get(missionName)
        const image = mission.algorithms.acquire(date, geometry)

        const modified = applyExpression(image, expression, mission.bands)
        const layer = generateLayer(modified, satellite, name, {})

        yield put(Imagery.Actions.loadLayer(layer, parent))
    }
}