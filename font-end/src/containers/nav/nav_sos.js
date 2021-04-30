import OuanIcon from '../function/OuanIcon';
export const nav_sos_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['sos management'],
}

export const nav_sos_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'แจ้งเตือนฉุกเฉิน',
    icon: <OuanIcon name="FaSms" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการ',
            route: '/icons',
            to: '/sos',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติ',
            route: '/icons',
            to: '/sos-history',
        },
    ]
}
