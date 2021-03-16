import React, { useState } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Watch from './pages/Watch';
import All from './pages/All'

const App = () => {

  const [ showMenu, updateMenu ] = useState(false)

  const GetNavigation = ({ selected }) => {
    return <Navigation updateMenu={ (shown) => updateMenu(() => shown) } shown={ showMenu } selected={ selected } />
  }

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <GetNavigation selected="home" />
            <div className="menu-content">
              <Home toggleMenu={ () => updateMenu((show) => !show) } />
            </div>
          </Route>
          <Route exact path="/all">
            <GetNavigation selected="list-all" />
            <div className="menu-content">
              <All toggleMenu={ () => updateMenu((show) => !show) } />
            </div>
          </Route>
          <Route exact path="/:aId/:eNum">
            <div className="menu-content">
              <Watch />
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default App;
