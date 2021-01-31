import moment from "moment";
import pick from "lodash/pick";
import * as Indices from "./indices";

const ee = window.ee;

export const combineReducers = (...reducers) => {
  let group = null;

  for (const reducer of reducers) {
    if (group === null) {
      group = reducer;
    } else {
      group = group.combine(reducer, "", true);
    }
  }

  return group;
};

export const stringifyList = (list) => {
  const flatten = ee.List(list).flatten()

  const returnContent = () => {
    const rtail = flatten.slice(0, -1).iterate((cur, acc) => {
      return ee.String(acc).cat(ee.String(cur)).cat(', ')
    }, ee.String('"['))

    const rhead = ee.String(rtail).cat(list.get(-1)).cat(']"')

    return rhead
  }

  return ee.Algorithms.If(flatten.size().gt(0), returnContent(), ee.String('"[]"'))
}

export const generateVisualizationParams = mission => {
  const { red, green, blue } = mission.bands;
  return {
    ...mission.vizParams,
    bands: [red, green, blue]
  };
};

export const compareImages = (a, b) => {
  return (
    a !== undefined &&
    b !== undefined &&
    a.id === b.id &&
    a.version === b.version
  );
};

export const makeDifferenceParams = () => {
  return { palette: ["FF0000", "000000", "00FF00"] };
};

export const evaluate = query => {
  return query.evaluate.bind(query);
};

export const asImage = (satelliteData, index) => {
  const imageData = satelliteData.features[index];
  return ee.Image(imageData.id, imageData.version);
};

export const applyExpression = (image, expressionOrLabel, bands) => {
  const index = Indices.all().find(index => index.label === expressionOrLabel);

  const expression = index !== undefined ? index.expression : expressionOrLabel;

  console.log("Applying", expression);

  return image.expression(expression, {
    RED: image.select(bands.red),
    GREEN: image.select(bands.green),
    BLUE: image.select(bands.blue),
    NIR: image.select(bands.nir),
    SWIR: image.select(bands.swir)
  });
};

export const imageToKey = image => {
  return JSON.stringify(pick(image, "id", "version"));
};

export const filterClouds = (satelliteData, spacecraft, level) => {
  const validIndices = [];

  satelliteData.features.forEach((feature, i) => {
    const cloudLevel = parseFloat(
      feature.properties[spacecraft.cloudCoverProperty]
    );
    if (cloudLevel <= level) {
      validIndices.push(i);
    }
  });

  return validIndices;
};

export const getSatelliteCollection = satellite => {
  const { collectionSet } = satellite;

  if (Array.isArray(collectionSet)) {
    const [head, ...tail] = collectionSet;

    let root = ee.ImageCollection(head);

    // tail.forEach(
    //   collection => (root = root.merge(ee.ImageCollection(collection)))
    // ); // what is wrong ? everything, past me

    return root;
  }

  return ee.ImageCollection(collectionSet);
};

export const chooseSuitableImages = (
  begin,
  end,
  spacecraft,
  region,
  clouds,
  areaTol = 0.95
) => {
  const areaKey = "_TOTAL_AREA";
  const beginDate = moment(begin).format("YYYY-MM-DD");
  const endDate = moment(end).format("YYYY-MM-DD");

  const mapper = image => {
    image = image.clip(region);
    return image.set(areaKey, image.geometry().area(1));
  };

  return getSatelliteCollection(spacecraft)
    .sort("system:time_start")
    .filterDate(beginDate, endDate)
    .filter(ee.Filter.lte(spacecraft.cloudCoverProperty, clouds))
    .filterBounds(region)
    .map(mapper)
    .filter(ee.Filter.gte(areaKey, region.area(1).multiply(areaTol)));
};

export const distinct = (list, comparator) => {
  if (comparator === undefined) {
    comparator = (a, b) => ee.Algorithms.IsEqual(a, b);
  }

  list = ee.List(list);

  return list.slice(1).iterate((current, last) => {
    last = ee.List(last);
    const condition = comparator(current, last.get(-1));

    return ee.Algorithms.If(condition, last, last.add(current));
  }, list.slice(0, 1));
};

export const simplify = amount => {
  return function (feature) {
    return ee.Feature(feature).simplify(amount);
  };
};
