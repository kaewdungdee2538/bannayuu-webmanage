import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  // },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['e-stamp management']
  }, {
    _tag: 'CSidebarNavDropdown',
    name: 'ตราประทับ',
    route: '/icons',
    icon: 'cil-star',
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
      },{
        _tag: 'CSidebarNavItem',
        name: 'ประวัติประทับตรา',
        route: '/icons',
        to: '/estamp-history',
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['parcel management']
  }, {
    _tag: 'CSidebarNavDropdown',
    name: 'พัสดุ',
    route: '/icons',
    icon: 'cil-inbox',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'รับ-ส่งพัสดุให้ลูกบ้าน',
        route: '/icons',
        to: '/parcel',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'ประวัติการรับ-ส่งพัสดุ',
        route: '/icons',
        to: '/parcel-history',
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['home management']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'หมู่บ้าน',
    route: '/icons',
    icon: 'cil-home',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'บ้าน',
        route: '/icons',
        to: '/home',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'จัดการลูกบ้าน',
        route: '/icons',
        to: '/villager'
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['complaint management'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'จัดการการคำร้องเรียน',
    icon: <CIcon name="cil-bookmark" customClasses="c-sidebar-nav-icon" />,
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
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['announce management'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'ประกาศโครงการ',
    icon: <CIcon name="cil-notes" customClasses="c-sidebar-nav-icon" />,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'จัดการประกาศโครงการ',
        route: '/icons',
        to: '/annouce',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'ประวัติประกาศโครงการ',
        route: '/icons',
        to: '/annouce-history',
      },
    ]
  },
]

export default _nav
