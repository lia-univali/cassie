const withPrefix = str => "cassie:" + str;

export const ID = "system:id";
export const VERSION = "system:version";
export const TIME_START = "system:time_start";
export const FOOTPRINT = "system:footprint";
export const CLOUD_SCORE = withPrefix("cloud_score");
export const CONTAINED = withPrefix("contained");
export const NAME = withPrefix("name");
export const GRID_POSITION = withPrefix("grid_position");

export const FeatureType = {
  TRANSECT: "transect",
  AOI: "area_of_interest",
  BASELINE: "baseline",
  COASTLINE: "coastline",
};
