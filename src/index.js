import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import configureStore from "./store"
import moment from "moment"
import Boot from "./Boot"
import i18n from './i18n'

const store = configureStore()
window.store = store
window.i18n = i18n
moment.locale("pt-BR")

ReactDOM.render(
  <Provider store={store}>
    <Boot />
  </Provider>,
  document.getElementById("root")
)