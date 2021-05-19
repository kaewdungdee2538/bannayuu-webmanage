import './TheHeader.css'
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import io from "socket.io-client";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CImg,
  CLabel
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
import TheHeaderDropdownCompanyList from './TheHeaderDropdownCompanyList'
const TheHeader = () => {
  const socketRef = useRef();
  const authStore = useSelector(state => state)
  const company_list = authStore.company_list ? authStore.company_list : [];
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

  //--------------------------------
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
  //------------------------When employee can login more than 1 company then show combobox company_list
  let headerComboboxCompanyListElem = null;
  if (company_list.length > 1) {
    headerComboboxCompanyListElem = <CHeaderNav className="px-3 col-sm-12 col-md-12 col-lg-9 header-item-posotion-text-head">
     <h4><strong>โครงการ</strong></h4>
     <TheHeaderDropdownCompanyList
        authStore={authStore}
      />
    </CHeaderNav>
  }else{
    headerComboboxCompanyListElem = <CHeaderNav className="px-3 col-auto col-lg-9 header-item-posotion-text-head">
    <h4><strong>โครงการ {authStore.company_name}</strong></h4>
    </CHeaderNav>
  }
  //----------------------------------------
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
      {headerComboboxCompanyListElem}
      <CHeaderNav className="col-sm-12 col-md-12 col-lg-2 header-item-posotion">
        <TheHeaderDropdownNotif
          itemsCount={notiItemsCount}
        />
        <TheHeaderDropdown />
      </CHeaderNav>

    </CHeader>
  )
}

export default TheHeader
