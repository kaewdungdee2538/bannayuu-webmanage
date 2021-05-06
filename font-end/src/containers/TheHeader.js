import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import io from "socket.io-client";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  // CHeaderNavItem,
  // CHeaderNavLink,
  // CSubheader,
  // CBreadcrumbRouter,
  // CLink,
  CImg,
  // CAlert,
  // CProgress,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

// routes config
// import routes from '../routes'
import ApiRoute from "../apiroute";

import {
  TheHeaderDropdown,
  // TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  // TheHeaderDropdownTasks
} from './index'
import swal from 'sweetalert';
import AlertPopup from '../views/management/component/alert-popup/AlertPopup'
import { NotificationItemsAll } from './function/notification-items'
import store, { disAuthenticationLogin } from '../store'
// import LoadingModal from '../views/management/component/loading/LoadingModal'
import { useHistory } from 'react-router-dom'

const TheHeader = () => {
  const socketRef = useRef();
  const authStore = useSelector(state => state)
  const history = useHistory();
  //------------------State
  const [yourID, setYourID] = useState();
  // const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showAlertSos, setShowAlertSos] = useState(null);
  const [notiItemsCount, setNotiItemCount] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (authStore.authorization) {
      socketRef.current = io.connect(ApiRoute.socket_url);
      socketRef.current.on("socket_id", id => {
        setYourID(id);
      })
      getNotificationItemsAll();
      socketRef.current.on(`message_sos${authStore.company_id}`, (message) => {
        if (authStore.authorization) {
          const result = message.result;
          setMessage(`บ้านเลขที่ ${result.home_address} ขอความช่วยเหลือ`);
          setShowAlertSos(null);
          setShowAlertSos(10);
          getNotificationItemsAll();
        }
      })
    }
  }, []);

  function getNotificationItemsAll() {
    let isNotAuth;
    NotificationItemsAll({ authStore })
      .then((res) => {
        if (res.result) {
          const result = res.result;
   
          setNotiItemCount(result.all);
        } else if (res.statusCode === 401) {
          isNotAuth = res.error;
        } else swal("Warning!", res.error, "warning");
      })
      .catch((err) => {
        console.log(err);
        history.push("/page500");
      })
      .finally((value) => {
        document.body.style.cursor = "default";
        setShowLoading(false);
        if (isNotAuth) {
          swal("Warning!", isNotAuth, "warning");
          history.push("/");
          //clear state global at store 
          store.dispatch(disAuthenticationLogin());
        }
      });
  }
  // function receivedMessage(message) {
  //   setMessages(oldMsgs => [...oldMsgs, message]);
  // }

  // function sendMessage() {
  //   const messageObject = {
  //     body: message,
  //     id: yourID,
  //     company_id: authStore.company_id
  //   };
  //   setMessage("");
  //   socketRef.current.emit("send_sos", messageObject);
  // }


  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  let alertSos = null;
  if (showAlertSos) {
    alertSos = <AlertPopup
      color="danger"
      timeShowAlert={showAlertSos}
      setTimeShowAlert={setShowAlertSos}
      title="SOS"
      imgIcon="sos"
      text={message}
      activeClass={true}
      link="/sos"
    />
  }
  return (
    <CHeader withSubheader>
      {alertSos}
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/main">
        {/* <CIcon name="logo" height="48" alt="Logo"/> */}
        <CImg
          src={'./image/logo-no-background.svg'}
          height="48"
          width="100"
        />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        {/* <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>Settings</CHeaderNavLink>
        </CHeaderNavItem> */}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdownNotif
          itemsCount={notiItemsCount}
        />
        {/* <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/> */}
        <TheHeaderDropdown />
      </CHeaderNav>

      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            <CLink className="c-subheader-nav-link"href="#">
              <CIcon name="cil-speech" alt="Settings" />
            </CLink>
            <CLink 
              className="c-subheader-nav-link" 
              aria-current="page" 
              to="/dashboard"
            >
              <CIcon name="cil-graph" alt="Dashboard" />&nbsp;Dashboard
            </CLink>
            <CLink className="c-subheader-nav-link" href="#">
              <CIcon name="cil-settings" alt="Settings" />&nbsp;Settings
            </CLink>
          </div>
      </CSubheader> */}
    </CHeader>
  )
}

export default TheHeader
