import OuanIcon from '../function/OuanIcon';
export const nav_card_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['card management'],
}

export const nav_card_item =
{
    _tag: 'CSidebarNavDropdown',
    name: 'บัตร RFID',
    icon: <OuanIcon name="FaIdCardAlt" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการ',
            route: '/icons',
            to: '/card',
        },
    ]
}
