import React, { RefObject } from 'react'
import Navigation from '../components/Navigation'

interface INavigationWrapper {
    contentId: string,
    navTrigger: RefObject<HTMLElement>,
    selected: string,
}

const NavigationWrapper = ({ children, contentId, navTrigger, selected }: React.PropsWithChildren<INavigationWrapper>) => {
    return (
        <>
            <Navigation shown={ false } trigger={ navTrigger } selected={ selected } />
            <div id={ contentId } className="menu-content">
                { children }
            </div>
        </>
    )
}

export default NavigationWrapper