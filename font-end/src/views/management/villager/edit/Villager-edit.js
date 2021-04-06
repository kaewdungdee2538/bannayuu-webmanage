import { useState, useEffect } from "react";
import "./Villager-edit.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CBadge,
} from "@coreui/react";
import swal from "sweetalert";
import CIcon from "@coreui/icons-react";
import VillagerInfoModal from "../info/Villager-info-modal";
import VillagerAddModal from "../add/Villager-add";
import store, { disAuthenticationLogin, selectHome, unSelectHome } from "../../../../store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getVillagerInfo, editVillager } from "./Villager-edit-controller";
import { deleteVillager } from "../delete/Villager-delete-controller";
import LoadingModal from '../../component/loading/LoadingModal';
import VillagerHomeChangeSelectHome from '../home-change/modal/Villager-home-change-modal'
const fields = ["แก้ไข", "เปลี่ยนบ้าน", "ชื่อ-สกุล", "เบอร์โทรศัพท์", "สถานะ"];
const getBadge = status => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'secondary'
    case 'pending': return 'warning'
    case 'banned': return 'danger'
    default: return 'primary'
  }
}
const CoreUILineHomeEdit = (props) => {
  const history = useHistory();
  const authStore = useSelector((store) => store);
  const [villagerInfo, setVillagerInfo] = useState(null);
  const [refesh, setRefeshForm] = useState(false);
  //----------------------------State
  const [selectedRow, setSelectedRow] = useState({
    selected: false,
    home_id: "",
    home_line_id: "",
    home_line_code: ""
  });
  const [showLoading, setShowLoading] = useState(false);
  const [showModalHomeChange, setShowModalHomeChange] = useState(false);
  const [selectedHomeChange, setSelectHomeChange] = useState({
    home_line_id: "",
  })
  //-------------------Show loading spiner
  let loadingmodal = null;
  if (showLoading) {
    loadingmodal = <LoadingModal
      setShowLoading={setShowLoading}
      showLoading={showLoading}
    />
  } else loadingmodal = null;
  //----------------------------Form load
  useEffect(() => {
    if (!authStore.authorization) {
      history.push("/");
    } else {
      refeshForm();
    }
  }, []);
  //----------------------------Refesh form
  function refeshForm() {
    let isNotAuth;
    document.body.style.cursor = "wait";
    setShowLoading(true)
    getVillagerInfo(authStore)
      .then((res) => {
        if (res.result) {
          if (res.result.length > 0) setVillagerInfo(res.result);
        } else if (res.statusCode === 401) {
          isNotAuth = res.error;
        } else swal("Warning!", res.error, "warning");
      })
      .catch((err) => {
        console.log(err);
        history.push("/page404");
      })
      .finally((value) => {
        document.body.style.cursor = "default";
        setShowLoading(false)
        if (isNotAuth) {
          swal("Warning!", isNotAuth, "warning");
          history.push("/");
          //clear state global at store 
          store.dispatch(disAuthenticationLogin());
        }
      });
  }
  if (refesh) {
    refeshForm();
    setRefeshForm(false);
  }
  //----------------------------Show edit modal
  let selectedrow = null;
  if (selectedRow.selected) {
    selectedrow = (
      <VillagerInfoModal
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setRefeshForm={setRefeshForm}
        setShowLoading={setShowLoading}
      />
    );
  }
  function onEditRowClick(event) {
    const home_id = event.target.getAttribute("home_id");
    const home_line_id = event.target.getAttribute("home_line_id");
    const home_line_code = event.target.getAttribute("home_line_code");
    setSelectedRow({
      selected: true
      , home_id
      , home_line_id
      , home_line_code
    })
  }
  //------------------------------Show create modal
  const [showCreate, setShowCreate] = useState(false);
  let showCreateModal = null;
  if (showCreate) {
    showCreateModal = (
      <VillagerAddModal showCreate={showCreate} setShowCreate={setShowCreate} setRefeshForm={setRefeshForm} setShowLoading={setShowLoading} />
    );
  }
  //------------------------------Home Change
  function onHomeChangeClick(event) {
    const home_line_id = event.target.getAttribute("home_line_id");
    setSelectHomeChange({ home_line_id })
    setShowModalHomeChange(true);
  }
  let elemModalHomeChange = null;
  if (showModalHomeChange) {
    elemModalHomeChange = <VillagerHomeChangeSelectHome
      selectedHomeChange={selectedHomeChange}
      showModalHomeChange={showModalHomeChange}
      setShowModalHomeChange={setShowModalHomeChange}
      setShowLoading={setShowLoading}
      setRefeshForm={setRefeshForm}
    />
  } else elemModalHomeChange = null;
  //------------------------------Delete villager
  function deleteVillagerInfo(event) {
    const home_id = event.target.getAttribute("home_id");
    const home_line_id = event.target.getAttribute("home_line_id");
    const home_line_code = event.target.getAttribute("home_line_code");
    const home_line_name = event.target.getAttribute("home_line_name");
    if (home_id) {
      swal({
        title: "Are you sure?",
        text: `คุณต้องการลบ ${home_line_name} หรือไม่!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            swal({
              title: "Delete!",
              text: "ต้องการลบลูกบ้านจริง หรือไม่!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
              .then((willDelete) => {
                if (willDelete) {
                  const villagerObj = {
                    home_id
                    , home_line_id
                  }
                  console.log(villagerObj)
                  document.body.style.cursor = 'wait';
                  deleteVillager({ authStore, villagerObj })
                    .then(res => {
                      if (res.error) swal({
                        title: "Waring.",
                        text: res.message,
                        icon: "warning",
                        button: "OK",
                      })
                      else {
                        swal("ลบลูกบ้านเรียนร้อย", {
                          icon: "success",
                        });
                        setRefeshForm(true);
                      }
                    }).catch(err => {
                      console.log(err)
                      history.push('/page404')
                    }).finally(value => {
                      document.body.style.cursor = 'default';
                    })
                } else {

                }
              });
          } else {
          }
        });
    }
  }
  //-------------------------------------------------
  return (
    <CCard>
      {loadingmodal}
      {selectedrow}
      {showCreateModal}
      {elemModalHomeChange}
      <CCardHeader className="villager-head">ลูกบ้าน</CCardHeader>
      <div className="btn-addhome">
        <CButton
          className="btn-class btn-head"
          color="success"
          onClick={() => setShowCreate(true)}
        >
          เพิ่มลูกบ้าน
        </CButton>
      </div>
      <CCardBody>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Villager Table</CCardHeader>
            <CCardBody>
              <CDataTable
                // onRowClick={onEditRowClick}
                items={villagerInfo}
                fields={fields}
                striped
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  'ชื่อ-สกุล': (item) => (
                    <td>
                      <span>
                        {item.home_line_first_name} {item.home_line_last_name}
                      </span>
                    </td>
                  ),
                  'เบอร์โทรศัพท์': (item) => (
                    <td>
                      <span>{item.home_line_mobile_phone}</span>
                    </td>
                  ),
                  'สถานะ': (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  )
                  // delete: (item) => (
                  //   <td>
                  //     <CButton
                  //       onClick={deleteVillagerInfo}
                  //       key={Date.now}
                  //       home_id={item.home_id}
                  //       home_line_id={item.home_line_id}
                  //       home_line_code={item.home_line_code}
                  //       home_line_name={`${item.home_line_first_name} ${item.home_line_last_name}`}
                  //       className="btn-class btn-delete"
                  //       color="danger"
                  //     >
                  //       <CIcon
                  //         home_id={item.home_id}
                  //         home_line_id={item.home_line_id}
                  //         home_line_code={item.home_line_code}
                  //         home_line_name={`${item.home_line_first_name} ${item.home_line_last_name}`}
                  //         name="cil-ban"
                  //       />
                  //       <span
                  //         home_id={item.home_id}
                  //         home_line_id={item.home_line_id}
                  //         home_line_code={item.home_line_code}
                  //         home_line_name={`${item.home_line_first_name} ${item.home_line_last_name}`}
                  //         className="btn-icon"
                  //       >
                  //         ลบ
                  //       </span>
                  //     </CButton>
                  //   </td>
                  // ),
                  , 'แก้ไข': (item) => (
                    <td>
                      <CButton
                        onClick={onEditRowClick}
                        key={Date.now}
                        home_id={item.home_id}
                        home_line_id={item.home_line_id}
                        home_line_code={item.home_line_code}
                        className="btn-class btn-edit"
                        color="primary"
                      >
                        <CIcon
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          name="cil-pencil"
                          color="danger"
                        />
                        <span
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          className="btn-icon"
                        >
                          แก้ไข
                        </span>
                      </CButton>
                    </td>
                  )
                  , 'เปลี่ยนบ้าน': (item) => (
                    <td>
                      <CButton
                        onClick={onHomeChangeClick}
                        key={Date.now}
                        home_id={item.home_id}
                        home_line_id={item.home_line_id}
                        home_line_code={item.home_line_code}
                        className="btn-class btn-home-change"
                      // color="warning"
                      >
                        <CIcon
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          name="cil-fullscreen-exit"
                          color="danger"
                        />
                        <span
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          className="btn-icon"
                        >
                          เปลี่ยนบ้าน
                        </span>
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CCardBody>
      {/* {selectedrow} */}
    </CCard>
  );
};

export default CoreUILineHomeEdit;
