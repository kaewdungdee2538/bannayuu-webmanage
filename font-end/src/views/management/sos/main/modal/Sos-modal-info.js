import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Sos-modal-info.css'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import ImageBox from '../../../component/image/ImageBox'
import { getSosInfoBydID, sendCorporateReceive, sendCorporateReject } from './Sos-modal-info-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import ApiRoute from '../../../../../apiroute'

const SosMainModal = ({ showSosModal, setShowSosModal, setRefeshForm, selectedObj, setShowLoading }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //---------------------State
    const [sosObj, setSosObj] = useState({
        sos_id: "",
        sos_code: "",
        sos_datetime: "",
        ref_sos_id: "",
        home_id: "",
        home_address: "",
        home_line_uuid: "",
        sos_header_text: "",
        sos_detail_text: "",
        sos_data: "",
        sos_picture_data: "",
        sos_remark: "",
        sos_status: "",
        company_name: ""
    })
    const [remark, setRemark] = useState('')
    const [imageSos, setImageSos] = useState(null)
    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            setShowLoading(true)
            getSosInfoBydID({ authStore, selectedObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setSosObj(result);
                        console.log(result)
                        setImageSos(ApiRoute.image_line_sos_url + result.img_sos)
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
    }, [])
    //--------------------------Close Modal
    function closeModal(event) {
        setShowSosModal(false);
        setRefeshForm(true);
    }
    //---------------------------Middle save
    function saveMiddleware() {
        const formathome = /[`@#$%^&*;'|<>~]/;
        if (!remark || remark.length === 0) {
            swal("Warning!", "กรุณากรอกหมายเหตุ", "warning");
            return false;
        } else if (formathome.test(remark)) {
            swal("Warning!", "หมายเหตุ ห้ามมีอักขระพิเศษ", "warning");
            return false;
        }
        return true;
    }
    //---------------------------Save Corporate receive
    function onSaveReceiveClick() {
        if (saveMiddleware()) {
            sendCorporateReceiveModal();
        }
    }
    function sendCorporateReceiveModal() {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                sos_id: sosObj.sos_id
                , sos_remark: remark
            }
        }
        let isNotAuth;
        sendCorporateReceive(values).then(res => {
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
                    text: "รับเรื่องเรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshForm(true)
                closeModal();
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
    //-------------------------Cancel 
    function onClickSaveCancel(event) {
        if (saveMiddleware()) {
            swal({
                title: "Are you sure?",
                text: "ต้องการยกเลิกแจ้งเตือนฉุกเฉิน หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        saveCorporateReject();
                    }
                });
        }
    }

    function saveCorporateReject() {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                sos_id: sosObj.sos_id
                , sos_remark: remark
            }
        }
        let isNotAuth;
        sendCorporateReject(values).then(res => {
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
                    text: "ยกเลิกเรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshForm(true)
                closeModal();
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
    //----------------------------------------------
    return (
        <CModal
            show={showSosModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>ทำรายการรับเรื่องแจ้งเตือนฉุกเฉิน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={sosObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสแจ้งเตือนฉุกเฉิน"
                                text={sosObj.sos_code}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={sosObj.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="วันที่แจ้ง"
                                text={sosObj.sos_datetime}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดการแจ้ง"
                                rows="3"
                                text={sosObj.sos_detail_text}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพการแจ้งเตือนฉุกเฉิน"
                                isNotStandard={true}
                                link={imageSos}
                            />
                        </CCol>
                    </CRow>
                    <br></br>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextArea
                                title="หมายเหตุ"
                                rows="3"
                                maxLength="250"
                                placeholder="Enter remark"
                                text={remark}
                                setText={setRemark}

                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="form-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="danger" onClick={onClickSaveCancel}>
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ยกเลิกแจ้งเตือน</span>
                    </CButton>
                </div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="primary" onClick={onSaveReceiveClick}>
                        <CIcon
                            name="cil-check"
                            color="danger" />
                        <span className="btn-icon-footer">รับเรื่องแจ้งเตือนฉุกเฉิน</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>
                        <span className="btn-icon-footer">ยกเลิก</span>
                    </CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default SosMainModal