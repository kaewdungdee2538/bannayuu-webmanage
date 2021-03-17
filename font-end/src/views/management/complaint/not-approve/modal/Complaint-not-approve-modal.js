import React from 'react'
import './Complaint-not-approve-modal.css'
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
import { ComplaintNotApproveModalController } from './Complaint-not-approve-modal-controller'
import { ComplaintSaveReceiptModalController,ComplaintSaveRejectModalController } from './Complaint-not-approve-modal-controller'
import ApiRoute from '../../../../../apiroute'
const getBadge = status => {
    switch (status) {
        case 'N': return 'secondary'
        default: return 'primary'
    }
}
const getStatus = status => {
    switch (status) {
        case 'N': return 'ยังไม่ได้ตรวจสอบ'
        default: return 'ตรวจสอบแล้ว'
    }
}
export default function ComplaintNotApproveModal(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------State
    const { hci_id, hci_code, showModal, setShowModal, setRefeshForm } = props;
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
    })
    const [remark, setRemark] = useState('');
    const [imageComplaint, setImageComplaint] = useState('./image/camera-icon.png')
    //--------------Form Load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            document.body.style.cursor = "wait";
            const selectObj = { hci_id, hci_code }
            ComplaintNotApproveModalController({ authStore, selectObj })
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
                        });
                        //----------------Set image path
                        const image_url = ApiRoute.image_url + result.img_complaint;
                        console.log(image_url)
                        setImageComplaint(image_url);
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
    }, [])
    //--------------Close Modal
    function closeModal(event) {
        setShowModal(false)
    }
    //--------------onClickSave
    function onClickSaveReceipt(event) {
        if (saveMiddleware()) {
            const complaintObject = {
                hci_id: complaintObj.hci_id
                , hci_remark: remark
            }
            ComplaintSaveReceiptModalController({ authStore, complaintObject })
                .then(res => {
                    document.body.style.cursor = 'wait';
                    if (res.error)
                        swal({
                            title: "Waring.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                    else {
                        swal({
                            title: "Success.",
                            text: "รับเรื่องร้องเรียนเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        closeModal();
                        setRefeshForm(true);
                    }
                }).catch(err => {
                    console.log(err)
                    history.push('/page404')
                }).finally(value => {
                    document.body.style.cursor = 'default';
                })
        }
    }
    //---------------on click reject
    function onClickSaveReject(event) {
        swal({
            title: "Are you sure?",
            text: "ต้องการปฏิเสธคำร้องเรียน หรือไม่!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                saveReject();
            } 
          });
    }
    function saveReject(){
        if (saveMiddleware()) {
            const complaintObject = {
                hci_id: complaintObj.hci_id
                , hci_remark: remark
            }
            ComplaintSaveRejectModalController({ authStore, complaintObject })
                .then(res => {
                    document.body.style.cursor = 'wait';
                    if (res.error)
                        swal({
                            title: "Waring.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                    else {
                        swal({
                            title: "Success.",
                            text: "ปฏิเสธคำร้องเรียนเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        closeModal();
                        setRefeshForm(true);
                    }
                }).catch(err => {
                    console.log(err)
                    history.push('/page404')
                }).finally(value => {
                    document.body.style.cursor = 'default';
                })
        }
    }
    //---------------Middleware
    function saveMiddleware() {
        const formathome = /[`@#$%^&*;'|<>~]/;
        if (!remark || remark.length === 0) {
            swal("Warning!", "กรุณากรอกข้อความแจ้งลูกบ้าน", "warning");
            return false;
        } else if (formathome.test(remark)) {
            swal("Warning!", "ข้อความแจ้งลูกบ้าน ห้ามมีอักขระพิเศษ", "warning");
            return false;
        }
        return true;
    }
    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            size="lg"
        >
            <CModalHeader closeButton className="modal-header">
                <CModalTitle>คำร้องที่ยังไม่ได้ตรวจสอบ</CModalTitle>
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
                            <TextArea
                                title="ข้อความแจ้งลูกบ้าน"
                                placeholder="Enter remark to villager"
                                text={remark}
                                setText={setRemark}
                                maxLenght="255"
                                rows="3"
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div>
                    <CButton className="btn-modal-footer" color="danger" onClick={onClickSaveReject}>
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon">ปฏิเสธคำร้องเรียน</span>
                    </CButton>
                </div>
                <div>
                    <CButton className="btn-modal-footer" color="info" onClick={onClickSaveReceipt}>
                        <CIcon
                            name="cil-bookmark"
                            color="info" />
                        <span className="btn-icon">รับเรื่องร้องเรียน</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}
