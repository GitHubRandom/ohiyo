interface IMenuEntry {
    id: string,
    title: string,
    path: string,
    icon: string,
    visible: boolean
}

const MENU_ENTRIES: IMenuEntry[] = [
    {
        id: "home",
        title: "آخر الحلقات",
        path: "/",
        icon: "mdi-television-classic",
        visible: true
    },
    {
        id: "movies",
        title: "آخر الأفلام",
        path: "/movies",
        icon: "mdi-filmstrip-box",
        visible: true
    },
    {
        id: "list-all",
        title: "قائمة الأنمي",
        path: "/all",
        icon: "mdi-format-list-text mdi-flip-h",
        visible: true
    },
    
    {
        id: "ranked",
        title: "تصنيف الأنمي",
        path: "/ranked",
        icon: "mdi-chevron-triple-up",
        visible: true
    },
    {
        id: "library",
        title: "مكتبتي",
        path: "/library",
        icon: "mdi-bookshelf",
        visible: false
    }
]

export { MENU_ENTRIES }