import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { omit } from 'lodash'

import { AppBar, Button, Menu, MenuItem, Paper, Tab, Tabs } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'

import TransectDataTable from '../visualization/TransectDataTable'
import { registerDialog } from './DialogRoot'

import Export from '../../../services/export'
import { exportCSV, exportJSON } from '../../../common/utils'
import { INTERNALS } from '../../../common/metadata'

const shapeTransectData = (transectData) => {
  return transectData.map(({ id, properties }) => ({ id: parseInt(id, 10), ...omit(properties, [INTERNALS]) }))
}

const CoastlineEvolutionDialog = ({ open, close }) => {
  const transects = useSelector(state => state.results.coastlineData ? state.results.coastlineData.transectData : [])
  const baselineData = useSelector(state => state.results.baselineData ? state.results.baselineData.baseline : {})
  const shorelineData = useSelector(state => state.results.coastlineData ? state.results.coastlineData.shorelineData : [])
  const transectData = shapeTransectData(transects)

  const [t] = useTranslation()

  const [tab, setTab] = useState(0)
  const [transectsAnchorEl, setTransectsAnchorEl] = useState(null)

  const tabs = [
    <TransectDataTable data={transectData} />
  ]

  return (
    <Dialog open={open} maxWidth='md' onClose={() => close()}>
      <DialogTitle>{t('forms.shorelineAnalysis.title')}</DialogTitle>
      <DialogContent>
        <Paper>
          <AppBar position='static' color='default'>
            <Tabs
              value={tab}
              indicatorColor='primary'
              textColor='primary'
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
                  exportCSV(transectData, 'transects.csv')
                  setTransectsAnchorEl(null)
                }}
              >
                {t('forms.shorelineAnalysis.exports.csv')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  exportJSON(transectData, 'transects.json')
                  setTransectsAnchorEl(null)
                }}
              >
                {t('forms.shorelineAnalysis.exports.json')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  Export.table.toDevice.asShapefileGroup(
                    [
                      { features: [{ geometry: { type: 'LineString', coordinates: baselineData.content || [] }, properties: {} }] },
                      { features: shorelineData.map(shoreline => ({ ...shoreline, properties: omit(shoreline.properties, [INTERNALS]) })) },
                      { features: transects.map(transect => ({ ...transect, properties: omit(transect.properties, [INTERNALS]) })) }
                    ],
                    Export.defaultOptions.device.shapefileGroup(
                      'layers',
                      'baseline',
                      'coastlines',
                      'transects'
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
        <Button color='primary' onClick={() => close()}>
          {t('forms.shorelineAnalysis.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default registerDialog('coastlineEvolution')(CoastlineEvolutionDialog)