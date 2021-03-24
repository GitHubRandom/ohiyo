import React, { useState } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Watch from './pages/Watch';
import All from './pages/All'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import 'tippy.js/dist/tippy.css'

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}


const App = () => {

    const GetNavigation = ({ selected }) => {
        return <Navigation trigger="#hamburger-menu" shown={ false } selected={selected} />
    }

    const Router = () => {
        let query = useQuery()
        return (
            <Switch>
                <Route exact path="/">
                    <GetNavigation selected="home" />
                    <div className="menu-content">
                        <Home />
                    </div>
                </Route>
                <Route exact path="/all">
                    <GetNavigation selected="list-all" />
                    <div className="menu-content">
                        <All />
                    </div>
                </Route>
                <Route exact path="/:aId">
                    <div className="menu-content">
                        <Watch fromEpisode={ query.get("from-episode") } />
                    </div>
                </Route>
                <Route exact path="/:aId/:eNum">
                    <div className="menu-content">
                        <Watch />
                    </div>
                </Route>
            </Switch>
        )
    }    

    return (
        <>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </>
    )
}

export default App;
