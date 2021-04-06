import React from 'react'
import './Complaint-success-modal.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CBadge,
    CRow,
    CLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CModalHeader,
    CModalTitle,
    CCarousel,
    CCarouselInner,
    CCarouselItem,
} from '@coreui/react'
import InputDisable from '../../../component/input/InputDisable'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import TextArea from '../../../component/textarea/TextArea'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import { ComplaintSuccessModalModalController } from './Complaint-success-modal-controller'
import ApiRoute from '../../../../../apiroute'
import store, { disAuthenticationLogin } from '../../../../../store'

const getBadge = status => {
    switch (status) {
        case 'N': return 'secondary'
        case 'REJECT': return 'danger'
        case 'RECEIPT': return 'warning'
        case 'CANCEL': return 'dark'
        default: return 'success'
    }
}
const getStatus = status => {
    switch (status) {
        case 'N': return 'ยังไม่ได้ตรวจสอบ'
        case 'REJECT': return 'ปฏิเสธคำร้อง'
        case 'RECEIPT': return 'กำลังดำเนินการ'
        case 'CANCEL': return 'ยกเลิกดำเนินการ'
        default: return 'ดำเนินการเรียบร้อย'
    }
}
export default function ComplaintSuccessModal(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------State
    const { hci_id, hci_code, showModal, setShowModal, setRefeshForm,setShowLoading } = props;
    const [complaintObj, setComplaintObj] = useState({
        hci_id: ""
        , hci_code: ""
        , post_date: ""
        , home_id: ""
        , hci_header_text: ""
        , hci_detail_text: ""
        , img_complaint: ""
        , hci_remark: ""
        , hci_status: ""
        , company_name: ""
        , home_address: ""
        , update_date :""
    })
    const [remark, setRemark] = useState('');
    const [imageComplaint, setImageComplaint] = useState('./image/camera-icon.png')
    //--------------Form Load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = "wait";
            const selectObj = { hci_id, hci_code }
            ComplaintSuccessModalModalController({ authStore, selectObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setComplaintObj({
                            hci_id: !result.hci_id ? "" : hci_id
                            , hci_code: !result.hci_code ? "" : result.hci_code
                            , post_date: !result.post_date ? "" : result.post_date
                            , home_id: !result.home_id ? "" : result.home_id
                            , hci_header_text: !result.hci_header_text ? "" : result.hci_header_text
                            , hci_detail_text: !result.hci_detail_text ? "" : result.hci_detail_text
                            , img_complaint: !result.img_complaint ? "" : result.img_complaint
                            , hci_remark: !result.hci_remark ? "" : result.hci_remark
                            , hci_status: !result.hci_status ? "" : result.hci_status
                            , company_name: !result.company_name ? "" : result.company_name
                            , home_address: !result.home_address ? "" : result.home_address
                            , update_date: !result.update_date ? "" : result.update_date
                        });
                        //----------------Set image path
                        const image_url = ApiRoute.image_url + result.img_complaint;
                        setImageComplaint(image_url);
                    }else if (res.statusCode === 401) {
                        isNotAuth = res.error
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
    //--------------Close Modal
    function closeModal(event) {
        setShowModal(false)
    }
    
    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            size="lg"
        >
            <CModalHeader closeButton className="modal-header">
                <CModalTitle>ประวัติการร้องเรียน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable title="ชื่อโครงการ" text={complaintObj.company_name} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="4">
                            <InputDisable title="ที่อยู่" text={complaintObj.home_address} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="4">
                            <InputDisable title="รหัสการร้องเรียน" text={complaintObj.hci_code} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable title="เรื่องที่ร้องเรียน" text={complaintObj.hci_header_text} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable title="รายละเอียดการร้องเรียน" text={complaintObj.hci_detail_text} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable title="วันที่ร้องเรียน" text={complaintObj.post_date} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable title="วันที่ปิดคำร้องเรียน" text={complaintObj.update_date} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CLabel>รูปภาพร้องเรียน</CLabel><br></br>
                            <div className="img-complaint">
                                <img src={imageComplaint} />
                            </div>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CLabel>สถานะ</CLabel><br></br>
                            <CBadge color={getBadge(complaintObj.hci_status)} className="status">
                                {getStatus(complaintObj.hci_status)}
                            </CBadge>
                        </CCol>
                        <CCol xs="12" sm="6">

                        </CCol>
                    </CRow>
                    <br></br>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="ข้อความแจ้งลูกบ้าน"
                                placeholder="Enter remark to villager"
                                text={complaintObj.hci_remark}
                                rows="3"
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div>
                  
                </div>
                <div>
                   
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}
