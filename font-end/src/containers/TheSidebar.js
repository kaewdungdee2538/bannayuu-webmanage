import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg
} from '@coreui/react'
import '../css/style.css'


// sidebar nav config
import GetNavBarItems from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const authStore = useSelector(state => state)
  const show = authStore.sidebarShow;
  const navItems = GetNavBarItems(authStore.privilege_info);
  
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/main">
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        /> */}
         <CImg
            src={'./image/logo-big.svg'}
            // className="c-avatar-img"
            className="c-sidebar-brand-full sidebar-head"
            height={70}
          />
           <CImg
            src={'./image/logo-big.svg'}
            // className="c-avatar-img"
            className="c-sidebar-brand-minimized"
            height={35}
          />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navItems}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
