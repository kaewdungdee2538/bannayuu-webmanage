import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import DropDownItem from '../views/management/component/dropdown/DropdownItem'
import NotificationIcon from '../views/management/component/header/notification-icon/NotificationIcon'
const TheHeaderDropdownNotif = (props) => {
  const { itemsCount } = props
  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        {/* <CIcon name="cil-bell" />
        <CBadge shape="pill" color="danger">{itemsCount}</CBadge> */}
        <NotificationIcon
          imgLink="./image/noti-sos.svg"
          itemsCount={itemsCount}
          badgeColor="danger"
        />
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>You have {itemsCount} notifications</strong>
        </CDropdownItem>
        <CDropdownItem to="/sos">
          <DropDownItem
            title="Sos"
            imgLink="./image/sos.svg"
            itemsCount={itemsCount}
            badgeColor="danger"
          />
        </CDropdownItem>

        <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>Server</strong>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>CPU Usage</b></small>
          </div>
          <CProgress size="xs" color="info" value={25} />
          <small className="text-muted">348 Processes. 1/4 Cores.</small>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif