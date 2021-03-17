import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'

import { HomePage, MainPage, FaqPage, ProblemsPage } from './app/pages'
import { Notifier, Scroller } from './app/components'
import { history } from './store'

import 'rc-slider/assets/index.css' // @TODO has raw css

const App = () => (
  <ConnectedRouter history={history}>
    <Scroller>
      <CssBaseline />
      <Notifier />
      <Switch>
        <Route path='/main' component={MainPage} />
        <Route path='/faq' component={FaqPage} />
        <Route path='/problems' component={ProblemsPage} />
        <Route path='/' component={HomePage} />
      </Switch>
    </Scroller>
  </ConnectedRouter>
)

export default App
