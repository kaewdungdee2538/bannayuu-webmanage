import OuanIcon from '../function/OuanIcon';
export const nav_payment_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['payment management']
}

export const nav_payment_corporate_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'เรียกเก็บค่าใช้จ่ายลูกบ้าน',
    route: '/icons',
    icon: <OuanIcon name="FaCity" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'จัดการ',
            route: '/icons',
            to: '/villager-cost-management',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติ',
            route: '/icons',
            to: '/villager-cost-history'
        },
    ]
}

export const nav_payment_villager_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'การจ่ายเงิน',
    route: '/icons',
    icon: <OuanIcon name="FaRegMoneyBillAlt" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'ตรวจสอบการโอนเงิน',
            route: '/icons',
            to: '/villager-payment-management',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'ประวัติ',
            route: '/icons',
            to: '/villager-payment-history'
        },
    ]
}
