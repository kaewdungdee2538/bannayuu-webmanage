import OuanIcon from '../function/OuanIcon';
export const nav_announce_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['announce management'],
}

export const nav_announce_item =
{
    _tag: 'CSidebarNavDropdown',
    name: 'ประกาศโครงการ',
    icon: <OuanIcon name="FaScroll" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการ',
            route: '/icons',
            to: '/annouce',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติ',
            route: '/icons',
            to: '/annouce-history',
        },
    ]
}
