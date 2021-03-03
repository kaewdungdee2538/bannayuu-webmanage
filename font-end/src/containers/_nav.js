import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['e-stamp management']
  }, {
    _tag: 'CSidebarNavDropdown',
    name: 'จัดการ',
    route: '/icons',
    icon: 'cil-drop',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'E-STAMP',
        route: '/icons',
        to: '',
      },
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['home management']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Home Management',
    route: '/icons',
    icon: 'cil-drop',
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
    _children: ['ประกาศโครงการ']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'ประกาศโครงการ',
    icon: <CIcon name="cil-drop" customClasses="c-sidebar-nav-icon" />,
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
