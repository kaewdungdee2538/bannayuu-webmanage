import "./Villager-info-modal.css";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormGroup,
  CLabel,
  CInput,
} from "@coreui/react";
import store, { selectHome, unSelectHome } from "../../../../store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getVillagerByIDInfo,
  editVillager,
} from "./Villager-info-modal-controller";
import InputDisable from "../../component/input/InputDisable";
import InputEnable from "../../component/input/InputEnable";
function VillagerInfoModal({ selectedRow, setSelectedRow,setRefeshForm }) {
  const history = useHistory();
  const authStore = useSelector((store) => store);
  const { selected, home_id, home_line_id, home_line_code } = selectedRow;
  //--------------------State
  const [homeObj, setHomeObj] = useState({
    home_id: "",
    home_code: "",
    home_address: "",
    home_line_id: "",
    home_line_code: "",
    company_name:"",
  });
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [mobilePhone,setMobilePhone] = useState('');
  const [remark,setRemark] = useState('');
  //-----------------------Form load
  useEffect(() => {
    if (!authStore.authorization) {
      history.push("/");
    } else {
      document.body.style.cursor = "wait";
      const villagerObj = {
        home_id,
        home_line_id,
        home_line_code,
      };
      getVillagerByIDInfo({ authStore, villagerObj })
        .then((res) => {
          if (res.result) {
            if (res.result.length > 0) {
              const result = res.result[0];
              setHomeObj((home) => {
                return {
                  ...home,
                  home_id,
                  home_code: result.home_code,
                  home_line_id,
                  home_line_code: result.home_line_code,
                  home_address: result.home_address,
                  company_name:result.company_name,
                };});
              setFirstName(result.home_line_first_name)
              setLastName(result.home_line_last_name)
              setMobilePhone(result.home_line_mobile_phone)
              setRemark(result.home_line_remark)
            } else swal("Warning!", "ไม่พบข้อมูลลูกบ้านในระบบ", "warning");
          } else swal("Warning!", res.error, "warning");
        })
        .catch((err) => {
          console.log(err);
          history.push("/page404");
        })
        .finally((value) => {
          document.body.style.cursor = "default";
        });
    }
  }, []);

  function closeModal(event) {
    setSelectedRow({ ...selectedRow, selected: false });
  }

  function editHomeModal() {
    document.body.style.cursor = "wait";
      const villagerObj = {
        home_id
        ,home_line_id
        ,home_line_code
        ,home_line_first_name:firstName
        ,home_line_last_name:lastName
        ,home_line_mobile_phone:mobilePhone
        ,home_line_remark:remark
      }
    editVillager({authStore,villagerObj})
    .then(res=>{
        if (res.error)
        swal({
          title: "Warning.",
          text: res.message,
          icon: "warning",
          button: "OK",
        });
      else {
        swal({
          title: "Success.",
          text: "เพิ่มบ้านเลขที่เรียบร้อย",
          icon: "success",
          button: "OK",
        });
        setRefeshForm(true);
        closeModal();
      }
    } ).catch(err=>{
        swal({
            title: "Error",
            text: err,
            icon: "error",
            button: "OK",
          });
    }).finally(value=>{
        document.body.style.cursor = "default";
    })
  }

  return (
    <CModal show={selected} onClose={closeModal} size="lg">
      <CModalHeader closeButton className="modal-villager-head-edit">
        <CModalTitle>แก้ไขข้อมูลบ้าน</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormGroup>
          <InputDisable title="Home code" text={homeObj.home_code} />
          <InputDisable title="บ้านเลขที่" text={homeObj.home_address} />
          <InputDisable title="Villager code" text={homeObj.home_line_code} />
          <InputEnable
            title="ชื่อ"
            placeholder="Enter first name"
            text={firstName}
            setText={setFirstName}
            maxLenght="100"
          />
         <InputEnable
            title="นามสกุล"
            placeholder="Enter last name"
            text={lastName}
            setText={setLastName}
            maxLenght="100"
          />
          <InputEnable
            title="เบอร์"
            placeholder="Enter mobile phone"
            text={mobilePhone}
            setText={setMobilePhone}
            maxLenght="10"
          />
          <InputEnable
            title="หมายเหตุ"
            placeholder="Enter remark"
            text={remark}
            setText={setRemark}
            maxLenght="250"
          />
          <InputDisable title="ชื่อหมู่บ้าน" text={homeObj.company_name} />
        </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton
          className="btn-modal-footer"
          color="primary"
          onClick={editHomeModal}
        >
          แก้ไข
        </CButton>
        <CButton
          className="btn-modal-footer"
          color="secondary"
          onClick={closeModal}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default VillagerInfoModal;
