import moment from 'moment';
import ColorConverter from 'color-convert';
import { bindActionCreators } from 'redux';

export const EPOCH = "1900-01-01T00:00:00Z";

export const fromEpoch = (value, units) => {
  return moment.utc(EPOCH).add(value, units);
}

export const toEpoch = (date, units) => {
  return moment(date).diff(moment.utc(EPOCH), units);
}

export const cloneClass = (original) => {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}

export const formatArea = (area, places = 3) => {
  if (area >= 1E6) {
    return (area / 1E6).toFixed(places) + " km²";
  } else {
    return area.toFixed(places) + " m²";
  }
}

// centre is an array with 2 elements: [x, y]
export const makeTriangle = (centre, radius) => {
  const alpha = Math.PI / 2;
  const beta = alpha + ((Math.PI * 2) / 3);
  const gamma = beta + ((Math.PI * 2) / 3);

  const computePosition = (angle, axis) => {
    const segment = axis === "x" ? Math.cos(angle) : Math.sin(angle);

    return (segment * radius) + centre[axis === "x" ? 0 : 1];
  }

  const topX = computePosition(alpha, "x")
  const topY = computePosition(alpha, "y")

  const leftX = computePosition(beta, "x")
  const leftY = computePosition(beta, "y")

  const rightX = computePosition(gamma, "x")
  const rightY = computePosition(gamma, "y")

  return [[topX, topY], [leftX, leftY], [rightX, rightY]];
}

export const lerp = (a, b, t) => {
  return a + t * (b - a);
}

export const normalize = (x, min, max) => {
  return (x - min) / (max - min);
}

export const asPercentage = (value) => {
  return (parseFloat(value) * 100).toFixed(2) + "%";
}

export const hasKeys = (object, ...keys) => {
  for (const key of keys) {
    if (!(key in object)) {
      return false;
    }
  }

  return true;
}

export const extractAlpha = (rgba) => {
  const res = rgba.match(/rgba\(.+,.+,.+,(.+)\)/);
  if (res && res[1]) {
    return parseFloat(res[1]);
  }
}

export const organizeHierarchically = (object, separator = "_") => {
  const result = {};
  Object.keys(object).forEach(k => {
    const [lhs, rhs] = k.match(new RegExp("(.*)" + separator + "(.+)"));

    if (result[lhs] === undefined) {
      result[lhs] = {};
    }

    result[lhs][rhs] = object[k];
  });

  return result;
}

export const sequence = (n, start = 0) => {
  return Array.from(Array(n).keys()).map(val => val + start);
}

export const selectKey = (arr, key) => {
  return arr.map(value => value[key]);
}

export const select = (obj, ...keys) => {
  const result = {};
  keys.forEach(key => result[key] = obj[key]);
  return result;
}

export const asPromise = (action, ...params) => {
  return new Promise((resolve, reject) => {
    action(...params, (success, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

export const generateColors = (amount, lightness = 50) => {
  const slice = amount === 1 ? 0 : 240.0 / (amount - 1);

  return sequence(amount).map(i => {
    return "#" + ColorConverter.hsl.hex(slice * i, 100, lightness);
  });
}

export const interpolateColors = (values, lowest, highest) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const absoluteMax = Math.max(Math.abs(min), Math.abs(max));

  lowest = ColorConverter.hex.rgb(lowest);
  highest = ColorConverter.hex.rgb(highest);

  console.log(lowest, highest);
  console.log(min, max, absoluteMax);
  console.log(values);

  return values.map(x => {
    x = normalize(x, -absoluteMax, absoluteMax);

    const rgb = lowest.map((value, i) => lerp(value, highest[i], x));
    return "#" + ColorConverter.rgb.hex(rgb);
  });
}

export const datesBetween = (dates, start, end) => {
  return dates.filter(date => moment(date).isSameOrAfter(start) && moment(date).isSameOrBefore(end));
}

export const formatDate = (date, withTime = false) => {
  const pattern = withTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY";
  return moment(date).format(pattern);
}

export const dateDiff = (dateA, dateB, measure = "years") => {
  return Math.abs(moment(dateA).diff(moment(dateB), measure));
}

export const formatDateDiff = (dateA, dateB) => {
  const years = dateDiff(dateA, dateB, "years");

  if (years === 0) {
    const months = dateDiff(dateA, dateB, "months");

    if (months === 0) {
      const days = dateDiff(dateA, dateB, "days");

      return `${days} dia${days === 1 ? '' : 's'}`;
    }

    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  return `${years} ano${years === 1 ? '' : 's'}`;
}

export const firstValue = object => {
  const key = Object.keys(object)[0];
  return object[key];
}

export const bindDispatchTo = (...classes) => {
  return dispatch => {
    const bound = {};
    classes.forEach(Class => {
      const instance = new Class(dispatch, Class.propName);
      bound[instance.name] = instance;
    });

    return bound;
  };
}

export const bindDispatch = (creators, actions = {}) => {
  return dispatch => {
    const bound = {};
    Object.keys(creators).forEach(key => {
      bound[key.toLowerCase()] = bindActionCreators(creators[key], dispatch);
    });

    return {...bound, ...bindActionCreators(actions, dispatch)};
  }
}

export const named = (subject, name) => {
  subject.propName = name;
  return subject;
}

export const exportCoordinates = (data, fileName) => {
  let output = data.map(coordinate => {
    return { lat: coordinate[0], long: coordinate[1]}
  })

  exportCSV(output, fileName)
}

export const exportCSV = (data, fileName, separator = ",") => {
  const columns = Object.keys(data[0]);

  let lines = columns.join(separator) + "\n";

  data.forEach((element) => {
    lines += columns.map(col => element[col]).join(separator) + "\n"
  });

  downloadText(lines, fileName, "text/csv");
}

export const exportJSON = (data, fileName) => {
  const json = JSON.stringify(data)
  downloadText(json, fileName, "text/geojson");
}

export const downloadText = (text, fileName, mimeType = "text/plain") => {
  const content = new Blob([text], {type: mimeType})
  const link = document.createElement("a");

  link.setAttribute("href", URL.createObjectURL(content));
  link.setAttribute("download", fileName);
  
  document.body.appendChild(link); // Required for FF

  link.click();

  document.body.removeChild(link);
}
