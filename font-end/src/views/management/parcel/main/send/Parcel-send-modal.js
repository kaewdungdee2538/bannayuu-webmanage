import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parcel-send-modal.css'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import InputEnable from '../../../component/input/InputEnable'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import ImageBox from '../../../component/image/ImageBox'
import { sendParcelSend,sendParcelReject } from './Parcel-send-modal-controller'
import { getParcelWaitSendBydID } from './Parcel-send-modal-controller'
import store, { disAuthenticationLogin } from '../../../../../store'

const ParcelSendModal = ({ showEditModal, setShowEditModal, setRefeshForm, selectedObj, setShowLoading }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const [parcelObj, setParcelObj] = useState({
        tpi_id: "", tpi_code: "", home_address: ""
        , tpi_title: "", tpi_detail: "", receive_parcel_datetime: ""
        , receive_parcel_by: "", receive_parcel_detail: ""
        , image_parcel_receive: "", tpi_status: "", company_name: ""
    })
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('Choose image');
    const [remark, setRemark] = useState('')
    const [imageParcel, setImageParcel] = useState(null)
    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            setShowLoading(true)
            getParcelWaitSendBydID({ authStore, selectedObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setParcelObj(result);
                        setImageParcel(result.image_parcel_receive)
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
        setShowEditModal(false);
        setRefeshForm(true);
    }

    function sendParcelModal() {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                image
                , tpi_id: parcelObj.tpi_id
                , tpi_code: parcelObj.tpi_code
                , send_parcel_detail: remark
            }
        }
        let isNotAuth;
        sendParcelSend(values).then(res => {
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
                    text: "ทำรายการรับพัสดุเรียบร้อย",
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
    //----------------------cancel click
    function onClickSaveCancel(event){
        if (saveMiddleware()) {
            swal({
                title: "Are you sure?",
                text: "ต้องการยกเลิกรับพัสดุ หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        saveParcelReceiveCancel();
                    }
                });
        }
    }
    function saveParcelReceiveCancel(){
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                image
                , tpi_id: parcelObj.tpi_id
                , tpi_code: parcelObj.tpi_code
                , send_parcel_detail: remark
            }
        }
        let isNotAuth;
        sendParcelReject(values).then(res => {
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
                    text: "ยกเลิกรับพัสดุเรียบร้อย",
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
    //------------------Middle ware
    function saveMiddleware(){
        return true;
    }
    //--------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-parcel">
                <CModalTitle>ทำรายการส่งพัสดุให้ลูกบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={parcelObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสรับพัสดุ"
                                text={parcelObj.tpi_code}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={parcelObj.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="หัวข้อการรับพัสดุ"
                                text={parcelObj.tpi_title}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่รับพัสดุ"
                                text={parcelObj.receive_parcel_datetime}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้รับพัสดุ"
                                text={parcelObj.receive_parcel_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดของพัสดุ"
                                rows="3"
                                text={parcelObj.receive_parcel_detail}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพพัสดุ"
                                link={imageParcel}
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
                    <CRow>
                        <CCol xs="12" md="12">
                            <CLabel>เลือกรูปภาพ</CLabel>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" name="filename"
                                    accept="image/*"
                                    onChange={async (event) => {
                                        const file = event.target.files.item(0);
                                        setImage(file)
                                        setFileName(file.name)
                                    }
                                    } />
                                <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
                            </div>
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="form-footer">
                <div>
                <CButton className="btn-modal-footer" color="danger" onClick={onClickSaveCancel}>
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ยกเลิกรับพัสดุ</span>
                    </CButton>
                </div>
                <div>
                    <CButton className="btn-modal-footer" color="primary" onClick={sendParcelModal}>
                        <CIcon
                            name="cil-check"
                            color="danger" />
                        <span className="btn-icon-footer">ส่งพัสดุให้ลูกบ้าน</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>
                        <span className="btn-icon-footer">ยกเลิก</span>
                    </CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParcelSendModal