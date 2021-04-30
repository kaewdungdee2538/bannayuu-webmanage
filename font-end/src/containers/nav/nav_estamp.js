import OuanIcon from '../function/OuanIcon';
export const nav_estamp_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['e-stamp management']
}
export const nav_estamp_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'ตราประทับ',
    route: '/icons',
    icon: <OuanIcon name="FaStamp" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'ประทับตราผู้มาเยือน',
            route: '/icons',
            to: '/estamp',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'เปลี่ยนบ้านให้ผู้มาเยือน',
            route: '/icons',
            to: '/estamp-home-change',
        }, {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติ',
            route: '/icons',
            to: '/estamp-history',
        },
    ]
}
