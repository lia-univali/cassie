const indices = [
  {label: "NDVI", expression: "(NIR - RED) / (NIR + RED)", params: {min: -1, max: 1}},
  {label: "NDWI", expression: "(GREEN - NIR) / (GREEN + NIR)", params: {min: -1, max: 1}},
  {label: "NDSI", expression: "(GREEN - SWIR) / (GREEN + SWIR)", params: {min: -1, max: 1}},
  {label: "NIR", expression: "NIR"},
  {label: "SI", expression: "(RED + GREEN) / 2"},
  // {label: "SI-A", expression: "(RED + GREEN) / 2 * (((GREEN - NIR) / (GREEN + NIR)) < 0.1)"},
  // {label: "SI-A/T1800", expression: "((RED + GREEN) / 2 * ((GREEN - NIR) / (GREEN + NIR) < 0.1)) > 1800"},
  // {label: "Cloud", expression: '((b("qa") >> 5) & 1) * ((b("qa") >> 6) & 3)', params: {min: 0, max: 3}},
  // {label: "Cloud2", expression: '((b("qa") >> 6) & 3)', params: {min: 0, max: 3}},
  // {label: "Cloud3", expression: '((b("qa") >> 6) & 3) > 0'},
  // {label: "Cloud4", expression: '((b("qa") >> 6) & 3) > 1'},
];

export const all = () => {
  return indices;
}

export const get = (index) => {
  return indices[index];
}

export const expression = (index) => {
  return indices[index].expression;
}

export const label = (index) => {
  return indices[index].label;
}

export const params = (index) => {
  return indices[index].params;
}

export const find = (label) => {
  for (let i = 0; i < indices.length; i++) {
    if (indices[i].label === label) {
      return i;
    }
  }

  return -1;
}
