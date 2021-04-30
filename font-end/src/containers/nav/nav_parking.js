import OuanIcon from '../function/OuanIcon';
export const nav_parking_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['parking rate'],
}

export const nav_parking_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'ค่าบริการจอดรถ',
    icon: <OuanIcon name="FaParking" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการ',
            route: '/icons',
            to: '/parking',
        },
    ]
}
