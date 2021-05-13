import { useState, useEffect } from 'react'
import './Card-edit-modal.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import InputEnable from '../../component/input/InputEnable'
import InputDisable from '../../component/input/InputDisable'

import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CCol,
    CRow,
} from '@coreui/react'
import { getCardByID, editCardRFID, disableCardRFID } from './Card-edit-controller'
import store, { disAuthenticationLogin } from '../../../../store'
import TextArea from '../../component/textarea/TextArea'
import CIcon from '@coreui/icons-react'

function CardEditModal({ showEditModal, setShowEditModal, setRefeshForm, setShowLoading, selectedObj }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [cardName, setCardName] = useState("");
    const [remark, setRemark] = useState("");
    const [cardObj, setCardObj] = useState({
        card_id: null,
        card_code: "",
        card_name: "",
        status: null,
        create_by: "",
        update_by: null,
        create_date: null,
        update_date: null,
        remark: null,
        company_name: ""
    })
    //---------------Form load
    useEffect(() => {
        setShowLoading(true);
        loadCardInfoFunc();
    }, [])
    //-------------Load
    function loadCardInfoFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            const valuesObj = {
                card_id: selectedObj.card_id
            }
            getCardByID({ authStore, valuesObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setCardObj(result);
                        setCardName(result.card_name);
                        setRemark(result.remark);
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
    }
    //-------------Close modal
    function closeModal() {
        setShowEditModal(false);
    }
    //--------------Edit card
    function onEditCard() {
        const middleware = editCardMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                card_id: cardObj.card_id,
                card_name: cardName,
                remark
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            editCardRFID({ authStore, valuesObj })
                .then(res => {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error
                        } else swal({
                            title: "Warning.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                    } else {
                        swal({
                            title: "Success.",
                            text: "เพิ่มบัตรเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setShowLoading(false)
                        setRefeshForm(true)
                        closeModal();
                    }
                    document.body.style.cursor = 'default';
                }).catch((err) => {
                    console.log(err);
                    history.push("/page500");
                })
                .finally((value) => {
                    setShowLoading(false)
                    document.body.style.cursor = "default";
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    function editCardMiddleware() {
        if (!cardName) return 'กรุณากรอกเลขบัตร'
        else if (!remark) return 'กรุณากรอกหมายเหตุ'
        return null;
    }
    //----------------------------On Disable
    function onDisableClick() {
        swal("หมายเหตุ:", {
            content: "input",
        })
            .then((value) => {
                if (!value)
                    swal({
                        title: "Warning.",
                        text: `กรุณากรอกหมายเหตุ`,
                        icon: "warning",
                        button: "OK",
                    });
                else swal({
                    title: "Are you sure?",
                    text: "ต้องการลบบัตร RFID หรือไม่!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        disableSaveClick(value);
                    }
                });
            });
    }
    function disableSaveClick(remarkInput) {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                card_id:cardObj.card_id,
                remark: remarkInput
            }
        }
        let isNotAuth;
        disableCardRFID(values).then(res => {
            if (res.error) {
                if (res.statusCode === 401)
                    isNotAuth = res.error
                else swal({
                    title: "Warning.",
                    text: res.message,
                    icon: "warning",
                    button: "OK",
                });

            } else {
                swal({
                    title: "Success.",
                    text: "ลบบัตร RFID เรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshForm(true);
                setShowEditModal(false);
            }

        }).catch(err => {
            console.log(err);
            history.push("/page500");
        }).finally(value => {
            document.body.style.cursor = 'default';
            setShowLoading(false);
            if (isNotAuth) {
                swal("Warning!", isNotAuth, "warning");
                history.push("/");
                //clear state global at store 
                store.dispatch(disAuthenticationLogin());
            }
        })
    }

    //-------------------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขบัตร RFID</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={cardObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="สร้างเมื่อ"
                                text={cardObj.create_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้สร้างบัตร"
                                text={cardObj.create_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="แก้ไขเมื่อ"
                                text={cardObj.update_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้แก้ไขล่าสุด"
                                text={cardObj.update_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="รหัสบัตร"
                                text={cardObj.card_code}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="เลขหน้าบัตร"
                                placeholder="Enter Card Name"
                                maxLenght="15"
                                text={cardName}
                                setText={setCardName}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextArea
                                title="หมายเหตุ"
                                placeholder="Enter detail"
                                maxLenght="250"
                                text={remark}
                                setText={setRemark}
                                rows="3"
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-class btn-modal-footer"
                        color="danger"
                        onClick={onDisableClick}
                    >
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ลบบัตร RFID</span>
                    </CButton>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="primary" onClick={onEditCard}>แก้ไข</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CardEditModal;