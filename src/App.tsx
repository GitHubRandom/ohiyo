import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Watch from './pages/Watch';
import All from './pages/All'
import { useLocation } from 'react-router-dom';
import 'tippy.js/dist/tippy.css'
import Library from './pages/Library';
import FourOFour from './pages/FourOFour';
import Ranked from './pages/Ranked';

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
                    <All filter={ query } />
                </Route>
                <Route exact path="/library">
                    <GetNavigation selected="library" />
                    <Library />
                </Route>
                <Route exact path="/ranked">
                    <GetNavigation selected="ranked" />
                    <Ranked />
                </Route>
                <Route exact path="/error/404">
                    <FourOFour />
                </Route>
                <Route exact path="/:aId(\d+)">
                    <Watch fromEpisode={ query.get("from-episode") } />
                </Route>
                <Route exact path="/:aId(\d+)/:eNum(\d+)">
                    <Watch fromEpisode="" />
                </Route>
                <Route>
                    <Redirect to="/error/404" />
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
