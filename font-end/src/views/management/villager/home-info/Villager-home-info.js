import { useState, useEffect } from "react";
import "./Villager-home-info.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
} from "@coreui/react";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getHomeInfo } from "./Villager-home-info-controller";
import store, { selectHome, unSelectHome,disAuthenticationLogin } from "../../../../store";
import LoadingModal from '../../component/loading/LoadingModal'
const fields = ["บ้านเลขที่", "เลือกบ้าน"];
const VillagerHomeInfo = () => {
  const history = useHistory();
  const authStore = useSelector((store) => store);

  //-------------------State
  const [homeInfo, setHomeInfo] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  //-------------------Show loading spiner
  let loadingmodal = null;
  if (showLoading) {
    loadingmodal = <LoadingModal
      setShowLoading={setShowLoading}
      showLoading={showLoading}
    />
  } else loadingmodal = null;
  //-------------------Form load
  useEffect(() => {
    //-------------------Reset Store
    store.dispatch(unSelectHome());
    if (!authStore.authorization) {
      history.push("/");
    } else {
      let isNotAuth;
      setShowLoading(true);
      document.body.style.cursor = "wait";
      getHomeInfo(authStore)
        .then((res) => {
          if (res.result) {
            if (res.result.length > 0) setHomeInfo(res.result);
          }else if (res.statusCode === 401) {
            isNotAuth = res.error;
          } 
        })
        .catch((err) => {
          console.log(err);
          history.push("/page404");
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
  }, []);
  //-------------------Select
  function onEditRowClick(event) {
    history.push("/villager/edit");
    store.dispatch(selectHome({ home_selected: event }));
  }

  return (
    <CCard>
      {loadingmodal}
      <CCardHeader className="form-main-header">บ้าน</CCardHeader>
      <CCardBody>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader className="form-section-header">
              Home Table
            </CCardHeader>
            <CCardBody>
              <CDataTable
                onRowClick={onEditRowClick}
                items={homeInfo}
                fields={fields}
                striped
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  'บ้านเลขที่': (item) => (
                    <td>
                      <span>{item.home_address}</span>
                    </td>
                  ),
                  'เลือกบ้าน': (item) => (
                    <td>
                      <CButton className="btn-class" color="primary">
                        เลือกบ้าน
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CCardBody>
    </CCard>
  );
};

export default VillagerHomeInfo;
