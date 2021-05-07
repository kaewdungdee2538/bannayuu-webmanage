import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parking-sub-edit-modal.css'
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
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'

import store, { disAuthenticationLogin, unSelectCPS } from '../../../../../store'
import { getParkingSubInfoByCPSID,editParkingSubInfo } from './Parking-sub-edit-modal-controller'

const ParkingSubEditModal = (props) => {
    const {
        showModalEdit
        , setShowModalEdit
        , setRefeshForm
        , setShowLoading
    } = props;

    const history = useHistory();
    const authStore = useSelector(state => state)
    const cph_id = authStore.cph_id;
    const cps_id = authStore.cps_id;
    const cartype_id = authStore.cartype_id;
    //--------------------------State
    const [parkingPrice, setParkingPrice] = useState("0");
    const [hoursStart, setHoursStart] = useState("0");
    const [minutesStart, setMinutesStart] = useState("0");
    const [secondsStart, setSecondsStart] = useState("0");
    const [hoursStop, setHoursStop] = useState("0");
    const [minutesStop, setMinutesStop] = useState("0");
    const [secondsStop, setSecondsStop] = useState("0");
    const [remark, setRemark] = useState("");
    const [parkingSubInfo, setParkingSubInfo] = useState({
        cps_id: null,
        cps_code: null,
        cpm_id: null,
        cpm_name_th: null,
        cpm_name_en: null,
        cph_id: null,
        cph_name_th: null,
        cph_name_en: null,
        cps_start_interval: {
            hours: 0,
            minutes: 0,
            seconds: 1
        },
        cps_stop_interval: {
            hours: 0,
            minutes: 0,
            seconds: 1
        },
        cps_amount_value: 0,
        cps_status: null,
        cps_remark: null,
        create_by: null,
        create_date: null,
        update_by: null,
        update_date: null,
        company_name: null
    });
    //----------------------Combobox value
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            getParkingSubInfo();
        }
    }, []);
    //--------------------------Get parking sub info
    function getParkingSubInfo() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = {
            cps_id
        }
        getParkingSubInfoByCPSID({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    const result = res.result;
                    setParkingSubInfo(result);
                    setParkingPrice(result.cps_amount_value);
                    const hStart = result.cps_start_interval.hours ? result.cps_start_interval.hours : "0"
                    const mStart = result.cps_start_interval.minutes ? result.cps_start_interval.minutes : "0"
                    const sStart = result.cps_start_interval.seconds ? result.cps_start_interval.seconds : "0"
                    const hStop = result.cps_stop_interval.hours ? result.cps_stop_interval.hours : "0"
                    const mStop = result.cps_stop_interval.minutes ? result.cps_stop_interval.minutes : "0"
                    const sStop = result.cps_stop_interval.seconds ? result.cps_stop_interval.seconds : "0"
                    setHoursStart(hStart);
                    setMinutesStart(mStart);
                    setSecondsStart(sStart);
                    setHoursStop(hStop);
                    setMinutesStop(mStop);
                    setSecondsStop(sStop);
                    setRemark(result.cps_remark);
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
                } else {
                    swal("Warning!", res.error, "warning");
                    setShowModalEdit(false);
                }
            })
            .catch((err) => {
                console.log(err);
                history.push("/page500");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                    setShowModalEdit(false);
                }
            });
    }
    //--------------------------Close Modal
    function closeModal(event) {
        setShowModalEdit(false);
        setRefeshForm(true);
        store.dispatch(unSelectCPS());
    }

    function editParkingSub() {
        if (!editParkingSubMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);

        const values = {
            authStore
            , valuesObj: {
                cph_id,cps_id
                ,start_interval:`${hoursStart}:${minutesStart}:${secondsStart}`
                ,stop_interval:`${hoursStop}:${minutesStop}:${secondsStop}`
                ,amount_value:parkingPrice
                ,remark
            }
        }
        let isNotAuth;
        editParkingSubInfo(values).then(res => {
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
                    text: "แก้ไขค่าบริการ เรียบร้อย",
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
    function editParkingSubMiddleware() {
        if (!hoursStart && !minutesStart && !secondsStart) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกเวลาจอด เริ่มต้น',
                icon: "warning",
                button: "OK",
            });
            return false;
        }else if(!hoursStop && !minutesStop && !secondsStop){
            swal({
                title: "Warning.",
                text: 'กรุณากรอกเวลาจอด สิ้นสุด',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (moment(`${hoursStart}:${minutesStart}:${secondsStart}`, "HH:mm:ss") >= moment(`${hoursStop}:${minutesStop}:${secondsStop}`, "HH:mm:ss")) {
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
            show={showModalEdit}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขค่าบริการจอดรถ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="สร้างโดย"
                                text={parkingSubInfo.create_by}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="สร้างเมื่อ"
                                text={parkingSubInfo.create_date}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="แก้ไขล่าสุดโดย"
                                text={parkingSubInfo.update_by}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="แก้ไขล่าสุดเมื่อ"
                                text={parkingSubInfo.update_date}
                            />
                        </CCol>
                    </CRow>
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
            <CModalFooter className="modal-footer">
                <div></div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="primary" onClick={editParkingSub}>บันทึก</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParkingSubEditModal