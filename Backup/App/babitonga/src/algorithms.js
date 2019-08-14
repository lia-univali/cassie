export const extractNDWI = (image, bands) => {
  return image.normalizedDifference([bands.green, bands.nir]);
};

export const extractNDVI = (image, bands) => {
  return image.normalizedDifference([bands.nir, bands.red]);
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
    const w1 = 1 - w0;

    if (w0 * w1 === 0) {
      continue;
    }

    u0 += histogramData.bucketMeans[t] * norm[t];

    const m0 = u0 / w0;
    const m1 = (ut - u0) / w1;

    const between = w0 * w1 * Math.pow(m0 - m1, 2);

    if (between >= betweenMax) {
      betweenMax = between;
      thresholdMax = histogramData.bucketMeans[t];
      indexMax = t;
    }
  }

  return {thresholdMax, indexMax};
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

  return {index: opt, value: arr[opt]};
}
