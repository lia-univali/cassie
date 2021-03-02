import { all, select, put } from 'redux-saga/effects'
import i18n from 'i18next'
import { concurrentHandler, bufferedHandler, callback, evaluate } from '../../tools/effects'
import { generateLayer, createThumbnail } from '../../../algorithms/imagery'
import { generateVisualizationParams } from '../../../algorithms/utils'
import { aggregateMissionsDates } from '../../../common/algorithms'
import { Types, Actions } from './header'
import { Actions as Imagery } from '../imagery'
import { getAcquisitionParameters, getImageryIdentifiers } from '../../../selectors'

const handleLoadAvailableImages = function* () {
  const { satellite, geometry } = yield select(getAcquisitionParameters)

  const missions = satellite.missions

  let availableByMission = []

  for (let mission of missions) {
    let regionData = {
      name: mission.name,
      shortname: mission.shortname,
      dates: yield evaluate(mission.algorithms.queryAvailable(geometry))
    }

    if (Object.keys(regionData.dates).length === 0 && mission.fallbackMission) {
      yield put(Actions.setMissionFallback(mission))

      const fallback = mission.fallbackMission

      regionData = {
        name: fallback.name,
        shortname: fallback.shortname,
        dates: yield evaluate(fallback.algorithms.queryAvailable(geometry))
      }
    }

    availableByMission.push(regionData)
  }

  const availableDates = aggregateMissionsDates(availableByMission)

  if (availableDates !== undefined) {
    yield put(Actions.setAvailableDates(availableDates, availableByMission))
  }
}

const handleAcquireImage = function* ({ payload: { missionName, date } }) {
  const { geometry, satellite } = yield select(getAcquisitionParameters)
  const { imageId } = yield select(getImageryIdentifiers)

  const mission = satellite.get(missionName)
  const image = mission.algorithms.acquire(date, geometry)

  const layer = generateLayer(image, mission, i18n.t('forms.imageryOverlay.base'))

  yield put(Imagery.pushImage(mission.shortname + '/' + date, date, mission.name))
  yield put(Imagery.loadLayer(layer, imageId))
}

const handleLoadThumbnails = function* () {
  const { geometry, satellite, availableDates } = yield select(getAcquisitionParameters)

  let id = 0

  for (const entry of availableDates) {
    const mission = satellite.get(entry.name)
    const image = mission.algorithms.acquire(entry.date, geometry)
    const url = yield callback(createThumbnail, image, geometry, generateVisualizationParams(mission))
    const clouds = yield evaluate(image.get('CLOUDS'))

    yield put(Actions.insertMetadata(entry.name, entry.date, {
      id: id++,
      thumbnail: url,
      clouds: clouds
    }))
  }
}

const root = function* () {
  yield all([
    concurrentHandler(Types.LOAD_AVAILABLE_IMAGES, handleLoadAvailableImages),
    bufferedHandler(Types.ACQUIRE_IMAGE, handleAcquireImage),
    concurrentHandler(Types.LOAD_THUMBNAILS, handleLoadThumbnails)
  ])
}

export default root