import OuanIcon from '../function/OuanIcon';
export const nav_cartype_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['announce management'],
}

export const nav_cartype_item =
{
    _tag: 'CSidebarNavDropdown',
    name: 'ประเภทรถ',
    icon: <OuanIcon name="FaShippingFast" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'ประเภท',
            route: '/icons',
            to: '/cartype',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'หมวดหมู่',
            route: '/icons',
            to: '/cartype-category',
        },
    ]
}
