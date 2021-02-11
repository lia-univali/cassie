import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { AppBar, Button, Menu, MenuItem, Paper, Tab, Tabs } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'

import TransectDataTable from '../../../containers/TransectDataTable'
import { registerDialog } from './DialogRoot'

import Export from '../../../services/Export'
import { exportCSV, exportJSON, exportCoordinates } from '../../../common/utils'

const shapeTransectData = (transectData) => {
  return transectData.map((content, i) => {
    const { id, geometry, properties } = content
    const [lngStart, latStart] = geometry.coordinates[0]
    const [lngEnd, latEnd] = geometry.coordinates[1]

    const { lrr, trend, sce, nsm, epr } = properties
    const r = trend.correlation
    const rSquared = Math.pow(r, 2)
    const intercept = trend.offset
    const slope = trend.scale
    const classification = properties.class

    const dates = Object.values(properties.distances).map(el =>
      moment(el.date)
    )
    const firstDate = moment(moment.min(dates)).format()
    const lastDate = moment(moment.max(dates)).format()

    return {
      id: parseInt(id, 10),
      lngStart,
      latStart,
      lngEnd,
      latEnd,
      firstDate,
      lastDate,
      intercept,
      slope,
      lrr,
      r,
      rSquared,
      sce,
      nsm,
      epr,
      class: classification
    }
  })
}

const CoastlineEvolutionDialog = ({ open, close }) => {
  const transects = useSelector(state => state.results.coastlineData ? state.results.coastlineData.transectData : [])
  const exportable = useSelector(state => state.results.coastlineData ? state.results.coastlineData.exportable : {})

  const transectData = shapeTransectData(transects)

  const [t] = useTranslation()

  const [tab, setTab] = useState(0)
  const [transectsAnchorEl, setTransectsAnchorEl] = useState(null)

  const tabs = [
    <TransectDataTable data={transectData} />
  ]

  return (
    <Dialog open={open} maxWidth="md" onClose={() => close()}>
      <DialogTitle>{t('forms.shorelineAnalysis.title')}</DialogTitle>
      <DialogContent>
        <Paper>
          <AppBar position="static" color="default">
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, tab) => setTab(tab)}
            >
              <Tab label={t('forms.shorelineAnalysis.transectsReport.title')} />
            </Tabs>
          </AppBar>
          {tabs[tab]}
        </Paper>
      </DialogContent>
      <DialogActions>
        {tab === 0 && (
          <div>
            <Button
              onClick={e => setTransectsAnchorEl(e.currentTarget)}
            >
              {t('forms.shorelineAnalysis.exports.title')}
            </Button>
            <Menu
              anchorEl={transectsAnchorEl}
              open={Boolean(transectsAnchorEl)}
              onClose={() => setTransectsAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  exportCSV(exportable.shpTransects.features.map(feature => feature.properties), "transects.csv")
                  setTransectsAnchorEl(null)
                }}
              >
                {t('forms.shorelineAnalysis.exports.csv')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  exportJSON(exportable.shpTransects.features, "transects.json")
                  setTransectsAnchorEl(null)
                }}
              >
                {t('forms.shorelineAnalysis.exports.json')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  Export.table.toDevice.asShapefileGroup(
                    [
                      exportable.shpBaseline,
                      exportable.shpCoasts,
                      exportable.shpTransects
                    ],
                    Export.defaultOptions.device.shapefileGroup(
                      "layers",
                      "baseline",
                      "coastlines",
                      "transects"
                    )
                  )
                  setTransectsAnchorEl(null)
                }}
              >
                {t('forms.shorelineAnalysis.exports.shp')}
              </MenuItem>
            </Menu>
          </div>
        )}
        <Button color="primary" onClick={() => close()}>
          {t('forms.shorelineAnalysis.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default registerDialog("coastlineEvolution")(CoastlineEvolutionDialog)