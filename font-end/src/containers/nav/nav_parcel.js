import OuanIcon from '../function/OuanIcon';
export const nav_parcel_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['parcel management']
}


export const nav_parcel_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'พัสดุ',
    route: '/icons',
    icon: <OuanIcon name="FaDollyFlatbed" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'รับ-ส่งพัสดุให้ลูกบ้าน',
            route: '/icons',
            to: '/parcel',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ยกเลิกส่ง-เปลี่ยนบ้าน',
            route: '/icons',
            to: '/parcel-change',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติการรับ-ส่งพัสดุ',
            route: '/icons',
            to: '/parcel-history',
        },
    ]
}
