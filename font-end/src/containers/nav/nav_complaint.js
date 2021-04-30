import OuanIcon from '../function/OuanIcon';
export const nav_complaint_head = {
    _tag: 'CSidebarNavTitle',
    _children: ['complaint management'],
}
export const nav_complaint_item = {
    _tag: 'CSidebarNavDropdown',
    name: 'จัดการการคำร้องเรียน',
    icon: <OuanIcon name="FaBullhorn" />,
    _children: [
        {
            _tag: 'CSidebarNavItem',
            name: 'ยังไม่ได้ตรวจสอบ',
            route: '/icons',
            to: '/complaint-not-apprive',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'กำลังดำเนินการ',
            route: '/icons',
            to: '/complaint-receipt',
        },
        {
            _tag: 'CSidebarNavItem',
            name: 'เรียบร้อย และยกเลิก',
            route: '/icons',
            to: '/complaint-success',
        },
    ]
}
