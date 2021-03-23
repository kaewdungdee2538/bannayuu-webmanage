import React, { useState, useEffect } from "react";
import "./Villager-add.css";
import swal from "sweetalert";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormGroup,
  CInput,
  CLabel,
  CModalFooter,
} from "@coreui/react";
import InputDisable from "../../component/input/InputDisable";
import InputEnable from "../../component/input/InputEnable";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addVillager } from "./Villager-add-controller";
import store, { disAuthenticationLogin } from "../../../../store";

function VillagerAddModal({ showCreate, setShowCreate, setRefeshForm, setShowLoading }) {
  const history = useHistory();
  const authStore = useSelector((store) => store);
  //------------------------------State
  const [villagerObj, setVillagerObj] = useState({
    address: "",
    address_code: "",
    villager_code: "",
  });
  const [villager_f_name, setVillager_f_name] = useState("");
  const [villager_l_name, setVillager_l_name] = useState("");
  const [villager_mobile_phone, setVillager_mobile_phone] = useState("");
  const [villager_remark, setVillager_remark] = useState("");
  //------------------------------Form load
  useEffect(() => {
    if (!authStore.authorization) {
      history.push("/");
    } else {
      document.body.style.cursor = "wait";
      setVillagerObj((villager) => {
        return {
          ...villager,
          address: authStore.home_selected.home_address,
          address_code: authStore.home_selected.home_code,
        };
      });
      document.body.style.cursor = "default";
    }
  }, []);

  //------------------------------Add Event
  function addHomeModal(event) {
    setShowLoading(true)
    document.body.style.cursor = "wait";
    const villagerObj = {
      villager_f_name,
      villager_l_name,
      villager_mobile_phone,
      villager_remark,
    };
    let isNotAuth;
    addVillager({ authStore, villagerObj }).then((res) => {
      if (res.error){
        if (res.statusCode === 401) {
          isNotAuth = res.error;
        }else swal({
          title: "Warning.",
          text: res.message,
          icon: "warning",
          button: "OK",
        });
      } else {
        swal({
          title: "Success.",
          text: "เพิ่มบ้านเลขที่เรียบร้อย",
          icon: "success",
          button: "OK",
        });
        setRefeshForm(true);
        closeModal();
      }
    }).catch((err) => {
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
  //------------------------------Close Event
  function closeModal(event) {
    setShowCreate(false);
  }

  return (
    <CModal
      show={showCreate}
      onClose={closeModal}
      closeOnBackdrop={false}
      borderColor="success"
      size="lg">
      <CModalHeader closeButton className="modal-villager-header-add">
        <CModalTitle>เพิ่มข้อมูลลูกบ้าน</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormGroup>
          <InputDisable title="Home code" text={villagerObj.address_code} />
          <InputDisable title="บ้านเลขที่" text={villagerObj.address} />
          <InputDisable title="Villager code" />
          <InputEnable
            title="ชื่อ"
            placeholder="Enter first name"
            text={villager_f_name}
            setText={setVillager_f_name}
            maxLenght="100"
          />
          <InputEnable
            title="นามสกุล"
            placeholder="Enter last name"
            text={villager_l_name}
            setText={setVillager_l_name}
            maxLenght="100"
          />
          <InputEnable
            title="เบอร์"
            placeholder="Enter mobile phone"
            text={villager_mobile_phone}
            setText={setVillager_mobile_phone}
            maxLenght="10"
          />
          <InputEnable
            title="หมายเหตุ"
            placeholder="Enter remark"
            text={villager_remark}
            setText={setVillager_remark}
            maxLenght="250"
          />
        </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton
          className="btn-modal-footer"
          color="success"
          onClick={addHomeModal}
        >
          เพิ่มข้อมูล
        </CButton>
        <CButton
          className="btn-modal-footer"
          color="warning"
          onClick={closeModal}
        >
          ยกเลิก
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default VillagerAddModal;
