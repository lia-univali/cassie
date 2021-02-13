import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

import configureStore from './store'
import moment from 'moment'
import Boot from './Boot'
import './i18n'

moment.locale("pt-BR")

ReactDOM.render(
  <Provider store={configureStore()}>
    <SnackbarProvider
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Boot />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root")
)