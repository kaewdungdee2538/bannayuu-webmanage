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
import store, { selectHome, unSelectHome } from "../../../../store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getVillagerInfo } from "./Villager-edit-controller";

const fields = ["edit", "name", "telephone", "delete"];

const CoreUILineHomeEdit = (props) => {
  const history = useHistory();
  const authStore = useSelector((store) => store);
  const [villagerInfo, setVillagerInfo] = useState(null);
  //----------------------------State
  const [selectedRow, setSelectedRow] = useState({
    selected: false,
    home_id: "",
    address: "",
    createdate: "",
    updatedate: "",
  });
  //----------------------------Form load
  useEffect(() => {
    if (!authStore.authorization) {
      history.push("/");
    }else{
        document.body.style.cursor = "wait";
        getVillagerInfo(authStore)
          .then((res) => {
            console.log(res.result);
            if (res.result) {
              if (res.result.length > 0) setVillagerInfo(res.result);
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
  //----------------------------Show edit modal
  let selectedrow = null;
  if (!!selectedRow) {
    selectedrow = (
      <VillagerInfoModal
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    );
  }
  function onEditRowClick(event) {
    setSelectedRow({ ...event, selected: true });
  }
  //------------------------------Show create modal
  const [showCreate, setShowCreate] = useState(false);
  let showCreateModal = null;
  if (!!showCreate) {
    showCreateModal = (
      <VillagerAddModal showCreate={showCreate} setShowCreate={setShowCreate} />
    );
  }

  return (
    <CCard>
      {selectedrow}
      {showCreateModal}
      <CCardHeader className="villager-head">ลูกบ้าน</CCardHeader>
      <div className="btn-addhome">
        <CButton
          className="btn-class"
          color="success"
          onClick={() => setShowCreate(true)}
        >
          เพิ่มลูกบ้าน
        </CButton>
      </div>
      <CCardBody>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader className="villager-head">Villager Table</CCardHeader>
            <CCardBody>
              <CDataTable
                // onRowClick={onEditRowClick}
                items={villagerInfo}
                fields={fields}
                striped
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  name: (item) => (
                    <td>
                      <span>
                        {item.home_line_first_name} {item.home_line_last_name}
                      </span>
                    </td>
                  ),
                  telephone: (item) => (
                    <td>
                      <span>{item.home_line_mobile_phone}</span>
                    </td>
                  ),
                  delete: (item) => (
                    <td>
                      <CButton
                       // onClick={deleteHomeModal}
                        home_id={item.home_id}
                        home_line_id={item.home_line_id}
                        home_line_code={item.home_line_code}
                        className="btn-class btn-delete"
                        color="danger"
                      >
                        <CIcon
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          name="cil-ban"
                        />
                        <span
                          home_id={item.home_id}
                          home_line_id={item.home_line_id}
                          home_line_code={item.home_line_code}
                          className="btn-icon"
                        >
                          ลบ
                        </span>
                      </CButton>
                    </td>
                  ),
                  edit: (item) => (
                    <td>
                      <CButton
                      // onClick={onEditRowClick}
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
