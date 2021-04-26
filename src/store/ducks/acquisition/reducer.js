import { Types } from "./header";

const INITIAL_STATE = {
  metadata: [],
  missions: [],
};

const reduceAvailableDates = (state, payload) => {
  if (payload.missions !== undefined) {
    return {
      ...state,
      availableDates: payload.dates,
      missions: payload.missions,
    };
  }

  if (state.missions !== undefined) {
    const available = payload.dates;
    let missions = [];

    state.missions.forEach((mission) => {
      const dates = mission.dates;
      let filteredDates = {};

      Object.keys(dates).forEach((date) => {
        const cur = available.find((value) => value.date === date);
        if (cur) {
          filteredDates[date] = dates[date];
        }
      });

      missions.push({
        name: mission.name,
        shortname: mission.shortname,
        dates: filteredDates,
      });
    });

    const metadata = state.metadata.filter((meta) => {
      return available.find(
        (value) => value.date === meta.date && value.name === meta.missionName
      );
    });

    return { ...state, metadata, availableDates: payload.dates, missions };
  }

  return { ...state, availableDates: payload.dates };
};

const reduceMissionFallback = (state, action) => {
  if (state.satellite) {
    const { mission } = action;

    const updated = state.satellite.missions.map((m) =>
      m.name === mission.name ? mission.fallbackMission : m
    );

    const satellite = {
      ...state.satellite,
      missions: updated,
      get: (name) => {
        const [first] = updated.filter((mission) => mission.name === name);
        return first;
      },
    };

    return { ...state, satellite };
  }
  return state;
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_SATELLITE:
      const { satellite, satelliteIndex } = action.payload;
      return { ...state, satellite, satelliteIndex };

    case Types.SET_MISSION_FALLBACK:
      return reduceMissionFallback(state, action.payload);

    case Types.SET_AOI:
      const { overlay, geometry, coordinates } = action.payload;
      return { ...state, overlay, geometry, coordinates };

    case Types.SET_AVAILABLE_DATES:
      return reduceAvailableDates(state, action.payload);

    case Types.SET_PERIOD:
      return { ...state, start: action.payload.start, end: action.payload.end };

    case Types.INSERT_METADATA: {
      const metadata = [
        ...state.metadata,
        {
          ...action.payload.metadata,
          missionName: action.payload.missionName,
          date: action.payload.date,
        },
      ];

      return { ...state, metadata };
    }

    case Types.LOAD_THUMBNAILS: {
      return { ...state, metadata: [] };
    }

    default:
      return state;
  }
};

export default reducer;
