export const extractNDWI = (image, bands) => {
  return image.normalizedDifference([bands.green, bands.nir]);
};

export const extractNDVI = (image, bands) => {
  return image.normalizedDifference([bands.nir, bands.red]);
};

export const extractSI = (image, bands) => {
  return image.select(bands.green)
    .add(image.select(bands.red))
    .divide(2);
};

export const otsuThreshold = (histogramData) => {
  const sum = histogramData.histogram.reduce((a, b) => (a + b), 0);
  let ut = 0;
  const norm = histogramData.histogram.map((v, i) => {
    ut += histogramData.bucketMeans[i] * (v / sum);
    return v / sum;
  });

  let w0 = 0;
  let u0 = 0;
  let betweenMax = 0;
  let thresholdMax = 0;
  var indexMax = 0;
  for (let t = 0; t < norm.length; t++) {
    w0 += norm[t];
    u0 += histogramData.bucketMeans[t] * norm[t];
    let w1 = 0;
    let u1 = 0;
    if (w0 === 0) {
      continue;
    }
    for (let z = t + 1; z < norm.length; z++) {
      w1 += norm[z];
      u1 += histogramData.bucketMeans[z] * norm[z];

      const w2 = 1 - w0 - w1;

      if (w1 * w2 === 0) {
        continue;
      }

      const m0 = u0 / w0;
      const m1 = u1 / w1;
      const m2 = (ut - u0 - u1) / w2;

      const between = w0 * Math.pow(m0 - ut, 2) +
        w1 * Math.pow(m1 - ut, 2) +
        w2 * Math.pow(m2 - ut, 2);

      if (between >= betweenMax) {
        betweenMax = between;
        thresholdMax = histogramData.bucketMeans[z];
        indexMax = z;
      }
    }
  }

  return { thresholdMax, indexMax };
};

export const improveThreshold = (initial, histogramData) => {
  const initialIndex = histogramData.bucketMeans.indexOf(initial);
  const left = findOptimal(histogramData.histogram, Math.max, 0, initialIndex).index;
  const right = findOptimal(histogramData.histogram, Math.max, initialIndex).index;
  const minimum = findOptimal(histogramData.histogram, Math.min, left, right).index;

  return histogramData.bucketMeans[minimum];
}

export const findOptimal = (arr, comparator, begin = 0, end = undefined) => {
  if (end === undefined) {
    end = arr.length;
  }

  let opt = begin;
  for (let i = begin + 1; i < end; i++) {
    if (comparator(arr[opt], arr[i]) === arr[i]) {
      opt = i;
    }
  }

  return { index: opt, value: arr[opt] };
}

export const summarizeMissionsDates = (missions, cloudThreshold = 1.0) => {
  const dates = {}

  missions.forEach(mission => {
    Object.keys(mission.dates).forEach(date => {
      if (mission.dates[date] <= cloudThreshold) {
        dates[date] = date in dates ? dates[date] + 1 : 1;
      }
    })
  })

  return dates;
}

export const uniteMissionsDates = (missions) => {
  const union = []

  missions.forEach(mission => {
    Object.keys(mission.dates).forEach(date => {
      union.push({
        name: mission.name,
        shortname: mission.shortname,
        date: date,
        content: mission.dates[date]
      })
    })
  })

  return union;
}

export const sortMissionsDates = (dates) => {
  return dates.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const uniqueMissionsDates = (dates) => {
  return [...new Set(dates)]
}

export const aggregateMissionsDates = (missions) => {
  return sortMissionsDates(uniteMissionsDates(missions));
}