import Navigation from '../components/Navigation'

const NavigationWrapper = ({ children, contentId, navTrigger, selected }) => {
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