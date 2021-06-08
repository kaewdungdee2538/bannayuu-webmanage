import OuanIcon from '../function/OuanIcon';
export const nav_home_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['home management']
}

export const nav_home_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'หมู่บ้าน',
    route: '/icons',
    icon: <OuanIcon name="FaHome" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'บ้าน',
            route: '/icons',
            to: '/home',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ลูกบ้าน',
            route: '/icons',
            to: '/villager'
        },
    ]
}


export const nav_license_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'ทะเบียนรถลูกบ้าน',
    route: '/icons',
    icon: <OuanIcon name="FaCar" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการทะเบียนรถ',
            route: '/icons',
            to: '/home-licenseplate',
        },
    ]
}
