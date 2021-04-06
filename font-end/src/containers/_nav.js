import React from 'react'
import CIcon from '@coreui/icons-react'
import { OuanIcon } from './function/OuanIcon'
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
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['parcel management']
  }, {
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
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['home management']
  },
  {
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
        name: 'จัดการลูกบ้าน',
        route: '/icons',
        to: '/villager'
      },
    ]
  },
  {
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
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['payment management']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'ค่าส่วนกลาง',
    route: '/icons',
    icon: <OuanIcon name="FaCity" />,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'จัดการ',
        route: '/icons',
        to: '/commonfee-management',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'ประวัติ',
        route: '/icons',
        to: '/commonfee-history'
      },
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'การจ่ายเงิน',
    route: '/icons',
    icon: <OuanIcon name="FaRegMoneyBillAlt" />,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'ตรวจสอบ',
        route: '/icons',
        to: '/commonfee-management',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'ประวัติ',
        route: '/icons',
        to: '/commonfee-history'
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
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['announce management'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'ประกาศโครงการ',
    icon: <OuanIcon name="FaScroll" />,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'จัดการ',
        route: '/icons',
        to: '/annouce',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'ประวัติ',
        route: '/icons',
        to: '/annouce-history',
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['sos management'],
  },
  {
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
  },
]

export default _nav
