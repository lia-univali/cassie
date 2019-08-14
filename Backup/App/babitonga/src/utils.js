export const formatArea = (area, places = 3) => {
  if (area >= 1E6) {
    return (area / 1E6).toFixed(places) + " km²";
  } else {
    return area.toFixed(places) + " m²";
  }
}
