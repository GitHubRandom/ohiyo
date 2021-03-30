import React, { useState } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Watch from './pages/Watch';
import All from './pages/All'
import { useLocation } from 'react-router-dom';
import 'tippy.js/dist/tippy.css'
import Library from './pages/Library';

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

const App = () => {

    const GetNavigation = ({ selected }: { selected: string }) => {
        return <Navigation trigger="#hamburger-menu" shown={ false } selected={ selected } />
    }

    const Router = () => {
        let query = useQuery()
        return (
            <Switch>
                <Route exact path="/">
                    <GetNavigation selected="home" />
                    <Home />
                </Route>
                <Route exact path="/all">
                    <GetNavigation selected="list-all" />
                    <All />
                </Route>
                <Route exact path="/library">
                    <GetNavigation selected="library" />
                    <Library />
                </Route>
                <Route exact path="/:aId">
                    <Watch fromEpisode={ query.get("from-episode") } />
                </Route>
                <Route exact path="/:aId/:eNum">
                    <Watch fromEpisode="" />
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
