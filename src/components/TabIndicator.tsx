interface ITabIndicator {
    items: Record<string,{
        title: string,
        icon: string
    }>,
    selected: string,
    setTab: (tab: string) => void
}

const TabIndicator = ({ setTab, items, selected }: ITabIndicator) => {
    return (
        <div className="tab-selection">
            { Object.keys(items).map((tab) => {
                return <span onClick={ () => setTab(tab) } className={ selected == tab ? "tab selected" : "tab" } id="tab"><span className={ `mdi ${ items[tab].icon }` }></span>{ items[tab].title }</span>
            }) }
        </div>
    )
}

export default TabIndicator