import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './License-lincese-modal-add.css'
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
import InputEnable from '../../../component/input/InputEnable'
import InputDisable from '../../../component/input/InputDisable'
import { addLicenseByHomeId } from './License-lincese-modal-add-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import { HaveSpecialFormat, HaveSpecialHomeFormat } from '../../../../../utils/utils'
const LicenseModalAdd = ({ showAddModal, setShowAddModal, setRefeshForm, setShowLoading, selectedRow }) => {
    const history = useHistory();
    const authStore = useSelector(state => state);
    //--------------------------State
    const [licensePlate, setLicensePlate] = useState('');
    const [carBrand, setCarBrand] = useState('');
    //--------------------------Close Modal
    function closeModal(event) {
        setShowAddModal(false);
        setRefeshForm(true);
    }

    function addLicenseModal() {
        if (!addLicenseMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                license_plate: licensePlate,
                car_brand: carBrand,
                home_id: selectedRow.home_id
            }
        }
        let isNotAuth;
        addLicenseByHomeId(values).then(res => {
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
                    text: "ทำรายการเพิ่มทะเบียนรถเรียบร้อย",
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
    //------------------------Middleware
    function addLicenseMiddleware() {
        if (!licensePlate) {
            swal({
                title: "Warning!",
                text: "กรุณากรอกทะเบียนรถ",
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (HaveSpecialFormat(licensePlate)) {
            swal({
                title: "Warning!",
                text: "ทะเบียนรถห้ามมีอักขระพิเศษ หรือช่องว่าง",
                icon: "warning",
                button: "OK",
            }); return false;
        } else if (HaveSpecialHomeFormat(carBrand)) {
            swal({
                title: "Warning!",
                text: "ยี่ห้อรถห้ามมีอักขระพิเศษ",
                icon: "warning",
                button: "OK",
            }); return false;
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
                <CModalTitle>เพิ่มทะเบียนรถลูกบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่"
                                text={selectedRow.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสรถ"
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
                    </CRow>  */}
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ทะเบียนรถ"
                                text={licensePlate}
                                setText={setLicensePlate}
                                maxLength={100}
                                placeholder="Enter license plate"
                            />
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ยี่ห้อรถ"
                                text={carBrand}
                                setText={setCarBrand}
                                maxLength={100}
                                placeholder="Enter car brand"
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <div></div>
                <div>
                    <CButton className="btn-modal-footer" color="success" onClick={addLicenseModal}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default LicenseModalAdd