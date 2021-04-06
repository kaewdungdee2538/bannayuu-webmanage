import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parcel-receive-add.css'
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
import InputEnable from '../../../component/input/InputEnable'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import { addParcelReceive } from './Parcel-receive-add-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import ComboBoxSearchItem from '../../../component/combobox/ComboBoxSearchItem'
const addressText = {
    id: 0, value: 'เลือกบ้าน'
}
const ParcelReceiveAdd = ({ showAddModal, setShowAddModal, setRefeshForm, setShowLoading, addressArray }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const [address, setAddress] = useState({ id: 0, value: '' });
    const [header, setHeader] = useState('');
    const [detail, setDetail] = useState('');
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('Choose image');
    //--------------------------Close Modal
    function closeModal(event) {
        setShowAddModal(false);
        setRefeshForm(true);
    }

    function addParcelModal() {
        if (!addParcelMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                address: address.value,
                header,
                detail,
                image
            }
        }
        let isNotAuth;
        addParcelReceive(values).then(res => {
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
            history.push("/page404");
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
    //------------------------Middleware
    function addParcelMiddleware() {
        if (address.id === 0) {
            swal({
                title: "Warning.",
                text: 'กรุณาเลือกที่อยู่',
                icon: "warning",
                button: "OK",
            });
            return false;
        }
        return true;
    }
    return (
        <CModal
            show={showAddModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>ทำรายการรับพัสดุให้ลูกบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสรับพัสดุ"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <ComboBoxSearchItem
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={addressText}
                                placeholder="Enter adress"
                                itemsArray={addressArray}
                                setText={setAddress}
                            />
                        </CCol>
                    </CRow>
                    {/* <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputEnable
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={address}
                                setText={setAddress}
                                maxLength={100}
                                placeholder="Enter address "
                            />
                        </CCol>
                    </CRow> */}
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="หัวข้อการรับพัสดุ"
                                text={header}
                                setText={setHeader}
                                maxLength={100}
                                placeholder="Enter parcel head"
                            />
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextArea
                                title="รายละเอียดของพัสดุ"
                                text={detail}
                                setText={setDetail}
                                maxLength={250}
                                rows="3"
                                placeholder="Enter parcel detail"
                            />
                        </CCol>
                    </CRow>
                    <br></br>
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
            <CModalFooter>
                <div></div>
                <div>
                    <CButton className="btn-modal-footer" color="success" onClick={addParcelModal}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParcelReceiveAdd