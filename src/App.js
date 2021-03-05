import React from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Watch from './pages/Watch';

const App = (props) => {
  return (
    <>
        <BrowserRouter>      
            <Switch>
              <Route exact path="/">
                <Navigation selected="home" />
                <div className="menu-content">
                  <Home/>
                </div>
              </Route>
              <Route exact path="/:aId/:eNum">
                <div className="menu-content">
                  <Watch/>
                </div>
              </Route>
            </Switch>
        </BrowserRouter>
    </>
  )
}

export default App;
