const withPrefix = str => 'cassie:' + str

export const ID = 'system:id'
export const VERSION = 'system:version'
export const TIME_START = 'system:time_start'
export const FOOTPRINT = 'system:footprint'
export const CLOUD_SCORE = withPrefix('cloud_score')
export const CONTAINED = withPrefix('contained')
export const NAME = withPrefix('name')
export const GRID_POSITION = withPrefix('grid_position')
export const INTERNALS = withPrefix('internals')

export const FeatureType = {
  TRANSECT: 'transect',
  AOI: 'area_of_interest',
  BASELINE: 'baseline',
  COASTLINE: 'coastline',
}

export const ESTEVES_LABELS = {
  'Stable': { class: 'Stable', color: '#43a047' },
  'Accreted': { class: 'Accreted', color: '#1976d2' },
  'Eroded': { class: 'Eroded', color: '#ffa000' },
  'Critically Eroded': { class: 'Critically Eroded', color: '#d32f2f' }
}