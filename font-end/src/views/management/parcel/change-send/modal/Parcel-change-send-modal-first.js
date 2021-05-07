import React, { useState } from 'react'
import swal from 'sweetalert';
import './Parcel-change-send-modal.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import {
    CButton,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CRow,
    CCol,
    CLabel,
    CBadge,
} from '@coreui/react'
import store, { disAuthenticationLogin } from '../../../../../store'
import ImageBox from '../../../component/image/ImageBox'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import {saveCancelSendParcel} from './Parcel-change-send-modal-controller'
import { getBadge, getStatus } from '../data/parcel-change-send-data'

function ParcelChangeSendModalFirst(props) {
    const {
        parcelObj,
        closeModal,
        imageReceive,
        imageSend,
        setShowFirstModal,
        setShowHomeChangeModal,
        setShowLoading,
        setRefeshForm,
     } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //---------------------------State
    const [remark, setRemark] = useState('')

    //---------------------------Change home
    function onChangeHomeClick() {
        setShowFirstModal(false);
        setShowHomeChangeModal(true);
    }
    //---------------------------Cancel Send Parcel
    function onClickSaveCancel() {
        if (saveMiddleware()) {
            swal({
                title: "Are you sure?",
                text: "ต้องการยกเลิกการส่งพัสดุ หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        saveParcelCancel();
                    }
                });
        }
    }
    function saveParcelCancel(){
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                 tpi_id: parcelObj.tpi_id
                , tpi_remark: remark
            }
        }
        let isNotAuth;
        saveCancelSendParcel(values).then(res => {
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
                    text: "ยกเลิกการส่งพัสดุเรียบร้อย",
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
    //-----------------------------Middleware
    return (
        <div>
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
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดของพัสดุ"
                                rows="3"
                                text={parcelObj.receive_parcel_detail}
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
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพพัสดุ"
                                link={imageReceive}
                            />
                        </CCol>
                    </CRow>
                    <hr></hr>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่ส่งมอบพัสดุ"
                                text={parcelObj.send_parcel_datetime}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้ส่งมอบพัสดุ"
                                text={parcelObj.send_parcel_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดการส่งมอบพัสดุ"
                                rows="3"
                                text={parcelObj.send_parcel_detail}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพการส่งมอบพัสดุ"
                                link={imageSend}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CLabel>สถานะ</CLabel>
                            <br></br>
                            <CBadge className="badge-modal" color={getBadge(parcelObj.tpi_status)}>
                                {getStatus(parcelObj.tpi_status)}
                            </CBadge>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
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
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="danger" onClick={onClickSaveCancel}>
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ยกเลิกการส่งพัสดุ</span>
                    </CButton>
                </div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="primary" onClick={onChangeHomeClick}>
                        <CIcon
                            name="cil-fullscreen-exit"
                            color="danger" />
                        <span className="btn-icon-footer">เปลี่ยนบ้าน</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>
                        <span className="btn-icon-footer">ยกเลิก</span>
                    </CButton>
                </div>
            </CModalFooter>
        </div>
    )
}

export default ParcelChangeSendModalFirst;