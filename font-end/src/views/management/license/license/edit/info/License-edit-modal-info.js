import '../modal/License-edit-modal-main.css'
import React, { useState } from 'react'
import swal from 'sweetalert';
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
    CSwitch,
} from '@coreui/react'
import store, { disAuthenticationLogin } from '../../../../../../store'
import InputDisable from '../../../../component/input/InputDisable'
import InputEnable from '../../../../component/input/InputEnable'
import TextArea from '../../../../component/textarea/TextArea'
import {saveLicenseEdit} from './license-edit-modal-info-controller'
import { HaveSpecialFormat, HaveSpecialHomeFormat } from '../../../../../../utils/utils'
function LicenseEditModalInfo(props) {
    const {
        CarObj,
        closeModal,
        setShowFirstModal,
        setShowHomeChangeModal,
        setShowLoading,
        setRefeshForm,
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //---------------------------State
    const [remark, setRemark] = useState('')
    const [licensePlate, setLicensePlate] = useState(CarObj.home_car_license_plate);
    const [carBrand,setCarBrand] = useState(CarObj.home_car_brand)
    const [check, setCheck] = useState(CarObj.status === 'active' ? true : false);
    //---------------------------Change home
    function onChangeHomeClick() {
        setShowFirstModal(false);
        setShowHomeChangeModal(true);
    }
    //---------------------------On Edit Click
    function onEditClick() {
        if(saveMiddleware()){
            saveEditLicense();
        }
    }
    function saveEditLicense(){
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                home_car_id: CarObj.home_car_id
                , license:licensePlate
                , car_brand:carBrand
                , remark
                , car_status:check
            }
        }
        let isNotAuth;
        saveLicenseEdit(values).then(res => {
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
                    text: "แก้ไขข้อมูลทะเบียนรถเรียบร้อย",
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
    function saveMiddleware() {
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
        }else if(!remark){
            swal({
                title: "Warning!",
                text: "กรุณากรอกหมายเหตุ",
                icon: "warning",
                button: "OK",
            });
            return false;
        }else if (HaveSpecialHomeFormat(remark)) {
            swal({
                title: "Warning!",
                text: "หามเหตุห้ามมีอักขระพิเศษ",
                icon: "warning",
                button: "OK",
            }); return false;
        }
        return true;
    }
    //--------------
    function onCheckBoxChange(event) {
        if (!event.target.checked) {
            swal({
                title: "ปิดสถานะ!",
                text: "ต้องการปิดสถานะทะเบียนรถคันนี้ หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        setCheck(false)
                    } else {

                    }
                });
        } else {
            setCheck(true)
        }
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
                                text={CarObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={CarObj.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่เพิ่มทะเบียนรถ"
                                text={CarObj.create_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้เพิ่มทะเบียนรถ"
                                text={CarObj.create_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่แก้ไขทะเบียนรถล่าสุด"
                                text={CarObj.update_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้แก้ไขทะเบียนรถล่าสุด"
                                text={CarObj.update_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ทะเบียนรถ"
                                text={licensePlate}
                                setText={setLicensePlate}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ยี่ห้อรถ"
                                text={carBrand}
                                setText={setCarBrand}
                            />
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
                    <CRow>
                        <CCol xs="12" sm="12">
                            <span>สถานะการใช้งาน</span>
                            <br></br>
                            <CSwitch
                                className={'mx-2'}
                                shape={'pill'}
                                color={'info'}
                                labelOn={'เปิด'}
                                labelOff={'ปิด'}
                                checked={check}
                                onChange={onCheckBoxChange}
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="primary" onClick={onChangeHomeClick}>
                        <CIcon
                            name="cil-fullscreen-exit"
                            color="danger" />
                        <span className="btn-icon-footer">เปลี่ยนบ้าน</span>
                    </CButton>
                </div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="success" onClick={onEditClick}>
                        <CIcon
                            name="cil-check"
                            color="danger" />
                        <span className="btn-icon-footer">แก้ไข</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>
                        <span className="btn-icon-footer">ยกเลิก</span>
                    </CButton>
                </div>
            </CModalFooter>
        </div>
    )
}

export default LicenseEditModalInfo;