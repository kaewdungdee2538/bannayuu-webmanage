import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Common-fee-history-modal.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CRow,
    CCol,
    CLabel,
    CBadge,
} from '@coreui/react'
import InputDisable from '../../../component/input/InputDisable'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import { CommonFeeManagementGetById } from './Common-fee-history-modal-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import {getBadge,getTextStatus} from '../data/common-fee-history-data'
const CommonFeeHistoryModal = ({ selectCommon, showModal, setShowModal, setRefeshForm, setShowLoading }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------------------State
    const [commonFeeObj, setCommonFeeObj] = useState({
        scfi_id: "",
        scfi_code: "",
        home_id: 0,
        home_address: "",
        date_from: "",
        date_to: "",
        payment_event_id: "",
        payment_amount: "",
        square_value: "",
        create_date: "",
        create_by: "",
        update_date: "",
        update_by: "",
        remark: "",
        delete_date: "",
        delete_by: "",
        company_name: ""
    });
    //--------------------------Form load
    useEffect(() => {
        let isNotAuth;
        document.body.style.cursor = "wait";
        setShowLoading(true)
        CommonFeeManagementGetById({ authStore, selectCommon })
            .then((res) => {
                if (res.result) {
                    setCommonFeeObj(res.result);
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
                } else swal("Warning!", res.error, "warning");
            })
            .catch((err) => {
                console.log(err);
                history.push("/page500");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                setRefeshForm(false);
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }, []);

    //--------------------------Close Modal
    function closeModal(event) {
        setShowModal(false);
    }
    //--------------------------Show combobox

    //--------------------------------
    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-history">
                <CModalTitle>ประวัติการเรียกเก็บค่าใช้จ่ายของลูกบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={commonFeeObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสการเรียกเก็บค่าใช้จ่าย"
                                text={commonFeeObj.scfi_code}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่"
                                text={commonFeeObj.home_address}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รายการค่าใช้จ่าย"
                                text={commonFeeObj.payment_event_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="ราคาต่อหน่วย (บาท)"
                                text={commonFeeObj.square_value}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รวมค่าใช้จ่าย (บาท)"
                                text={commonFeeObj.payment_amount}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="หมายเหตุ"
                                text={commonFeeObj.remark}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="วันที่เริ่มเก็บค่าใช้จ่าย"
                                text={commonFeeObj.date_from}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="วันที่สิ้นสุดเก็บค่าใช้จ่าย"
                                text={commonFeeObj.date_to}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="สร้างเมื่อ"
                                text={commonFeeObj.create_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="สร้างโดย"
                                text={commonFeeObj.create_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="แก้ไขเมื่อ"
                                text={commonFeeObj.update_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="แก้ไขโดย"
                                text={commonFeeObj.update_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="ยกเลิกเมื่อ"
                                text={commonFeeObj.delete_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ยกเลิกโดย"
                                text={commonFeeObj.delete_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CLabel>สถานะ</CLabel>
                            <br></br>
                            <CBadge className="badge-modal" color={getBadge(commonFeeObj.status)}>
                                {getTextStatus(commonFeeObj.status)}
                            </CBadge>
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div></div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CommonFeeHistoryModal;