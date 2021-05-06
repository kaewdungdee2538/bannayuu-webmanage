import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parking-sub-table-add-modal.css'
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
    CCardBody,
    CCard,
} from '@coreui/react'
import * as moment from 'moment';
import InputNumberEnable from '../../../component/input/InputNumberEnable'
import store, { disAuthenticationLogin } from '../../../../../store'
import { addParkingSubConfig } from './Parking-sub-table-add-modal-controller'
const ParkingSubAddModal = (props) => {
    const {
        showModalAdd
        , setShowModalAdd
        , setRefeshForm
        , setShowLoading
    } = props;

    const history = useHistory();
    const authStore = useSelector(state => state)
    const cph_id = authStore.cph_id;
    const cartype_id = authStore.cartype_id;
    //--------------------------State
    const [parkingPrice, setParkingPrice] = useState("0");
    const [hoursStart, setHoursStart] = useState("0");
    const [minutesStart, setMinutesStart] = useState("0");
    const [secondsStart, setSecondsStart] = useState("0");
    const [hoursStop, setHoursStop] = useState("0");
    const [minutesStop, setMinutesStop] = useState("0");
    const [secondsStop, setSecondsStop] = useState("0");
    //----------------------Combobox value
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        }
    }, []);
    //--------------------------Close Modal
    function closeModal(event) {
        setShowModalAdd(false);
        setRefeshForm(true);
    }

    function addParkingSub() {
        if (!addParkingSubMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);

        const values = {
            authStore
            , valuesObj: {
                cph_id,
                cartype_id,
                start_interval: `${hoursStart ? hoursStart : 0}:${minutesStart ? minutesStart : 0}:${secondsStart ? secondsStart : 0}`,
                stop_interval: `${hoursStop ? hoursStop : 0}:${minutesStop ? minutesStop : 0}:${secondsStop ? secondsStop : 0}`,
                amount_value: parkingPrice ? parkingPrice : 0
            }
        }
        let isNotAuth;
        addParkingSubConfig(values).then(res => {
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
                    text: "เพิ่มค่าบริการ เรียบร้อย",
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
    function addParkingSubMiddleware() {
        if (!hoursStart && !minutesStart && !secondsStart && !hoursStop && !minutesStop && !secondsStop) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกเวลาจอด',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (moment(`${hoursStart}:${minutesStart}:${secondsStart}`,"HH:mm:ss") >= moment(`${hoursStop}:${minutesStop}:${secondsStop}`,"HH:mm:ss")) {
            swal({
                title: "Warning.",
                text: 'เวลาจอดเริ่มต้นห้ามมากกว่า หรือเท่ากับเวลาจอดสิ้นสุด',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!parkingPrice) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกค่าบริการ',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!cph_id) {
            swal({
                title: "Warning.",
                text: 'ไม่พบรหัส Zone กรุณาเลือกรายการ Zone ใหม่อีกครั้ง',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!cartype_id) {
            swal({
                title: "Warning.",
                text: 'ไม่พบรหัสประเภทรถ กรุณากลับไปหน้าแรก แล้วใหม่อีกครั้ง',
                icon: "warning",
                button: "OK",
            });
            return false;
        }
        return true;
    }
    //------------------------------------------------------------
    return (
        <CModal
            show={showModalAdd}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>ทำรายการสร้างค่าบริการจอดรถ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <CLabel>เวลาจอดเริ่มคิดเงิน</CLabel>
                            <span style={{ color: "red" }}> (จำนวนเวลาจอดที่จะเริ่มคิดเงิน)</span>
                            <CCard>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": ชั่วโมง"
                                                text={hoursStart}
                                                setText={setHoursStart}
                                                placeholder="Hours"
                                                maxLenght={5}
                                            />
                                        </CCol>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": นาที"
                                                text={minutesStart}
                                                setText={setMinutesStart}
                                                placeholder="Minutes"
                                                maxLenght={2}
                                            />
                                        </CCol>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": วินาที"
                                                text={secondsStart}
                                                setText={setSecondsStart}
                                                placeholder="Seconds"
                                                maxLenght={2}
                                            />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <CLabel>ถึงเวลา</CLabel>
                            <span style={{ color: "red" }}> (จำนวนเวลาจอดสุดท้ายที่จะคิดเงินภายในช่วงเวลานี้)</span>
                            <CCard>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": ชั่วโมง"
                                                text={hoursStop}
                                                setText={setHoursStop}
                                                placeholder="Hours"
                                                maxLenght={5}
                                            />
                                        </CCol>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": นาที"
                                                text={minutesStop}
                                                setText={setMinutesStop}
                                                placeholder="Minutes"
                                                maxLenght={2}
                                            />
                                        </CCol>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": วินาที"
                                                text={secondsStop}
                                                setText={setSecondsStop}
                                                placeholder="Seconds"
                                                maxLenght={2}
                                            />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputNumberEnable
                                title="ค่าบริการจอดรถ"
                                text={parkingPrice}
                                setText={setParkingPrice}
                                placeholder="Enter Over Night Fine"
                                maxLenght={4}
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div></div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="success" onClick={addParkingSub}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParkingSubAddModal