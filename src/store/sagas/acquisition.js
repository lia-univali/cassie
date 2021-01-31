import * as Acquisition from '../ducks/acquisition'
import { call, all, select, put } from "redux-saga/effects";
import { generateLayer, createThumbnail } from "../../procedures/imagery";
import { createConcurrentHandler, createBufferedHandler, evaluate } from "../../common/sagaUtils";
import { generateVisualizationParams } from "../common/eeUtils";
import { loadLayer, pushImage } from "./imagery";
import { getAcquisitionParameters, getImageryIdentifiers } from "../../selectors";
import { aggregateMissionsDates } from '../../common/algorithms'
import i18next from 'i18next'

function* handleLoadAvailableImages() {
  const { satellite, geometry } = yield select(getAcquisitionParameters);

  const missions = satellite.missions;

  let availableByMission = [];

  for (let mission of missions) {
    availableByMission.push({
      name: mission.name,
      shortname: mission.shortname,
      dates: yield evaluate(mission.algorithms.queryAvailable(geometry))
    });
  }

  const availableDates = aggregateMissionsDates(availableByMission);

  if (availableDates !== undefined) {
    yield put(Acquisition.Actions
      .setAvailableDates(availableDates, availableByMission));
  }
}

function* handleAcquireImage({ missionName, date }) {
  const { geometry, satellite } = yield select(getAcquisitionParameters);
  const { imageId } = yield select(getImageryIdentifiers);

  const mission = satellite.get(missionName);
  const image = mission.algorithms.acquire(date, geometry);

  const layer = generateLayer(image, mission, i18next.t('forms.imageryOverlay.base'));

  yield put(pushImage(mission.shortname + "/" + date, date, mission.name));
  yield put(loadLayer(layer, imageId));
}

function* handleRequestAOI() { }

function* handleLoadThumbnails() {
  const { geometry, satellite, availableDates } = yield select(
    getAcquisitionParameters
  );

  let id = 0;

  for (const entry of availableDates) {
    const mission = satellite.get(entry.name);
    const image = mission.algorithms.acquire(entry.date, geometry);
    const url = yield call(
      createThumbnail,
      image,
      geometry,
      generateVisualizationParams(mission)
    );
    const clouds = yield evaluate(image.get("CLOUDS"));

    yield put(Acquisition.Actions.insertMetadata(entry.name, entry.date, { id: id++, thumbnail: url, clouds: clouds }));
  }
}

export function* saga() {
  yield all([
    createConcurrentHandler(Acquisition.Types.LOAD_AVAILABLE_IMAGES, handleLoadAvailableImages),
    createBufferedHandler(Acquisition.Types.ACQUIRE_IMAGE, handleAcquireImage),
    createBufferedHandler(Acquisition.Types.REQUEST_AOI, handleRequestAOI),
    createConcurrentHandler(Acquisition.Types.LOAD_THUMBNAILS, handleLoadThumbnails)
  ]);
}
