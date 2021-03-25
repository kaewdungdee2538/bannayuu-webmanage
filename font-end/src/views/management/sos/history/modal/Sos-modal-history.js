import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Sos-modal-history.css'
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
    CInputFile,
    CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import InputEnable from '../../../component/input/InputEnable'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import ImageBox from '../../../component/image/ImageBox'
import { getSosInfoBydID } from './Sos-modal-history-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import { getBadge, getStatus } from '../data/sos-history-data'
const SosHistoryModal = ({ showSosModal, setShowSosModal, selectedObj, setShowLoading }) => {
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
                        setImageSos(result.sos_picture_data)
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
    }


    return (
        <CModal
            show={showSosModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-sos">
                <CModalTitle>ประวัติการแจ้งเตือนฉุกเฉิน</CModalTitle>
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
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="หมายเหตุ"
                                rows="3"
                                text={sosObj.sos_remark}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพการแจ้งเตือนฉุกเฉิน"
                                link={imageSos}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="6" sm="6">
                            <div className="badge-status">
                                <CLabel>สถานะ</CLabel>
                                <CBadge color={getBadge(sosObj.sos_status)} className="badge-item">
                                    {getStatus(sosObj.sos_status)}
                                </CBadge>
                            </div>
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <div></div>
                <div>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default SosHistoryModal