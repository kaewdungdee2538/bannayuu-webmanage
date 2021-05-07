import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parking-header-add-modal.css'
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
import InputEnable from '../../../component/input/InputEnable'
import InputNumberEnable from '../../../component/input/InputNumberEnable'
import TimeMaterialUi from '../../../component/time/TimeMaterialUi'
import store, { disAuthenticationLogin } from '../../../../../store'
import { getParkingHeaderCheckPriority, addParkingHeaderConfig } from './Parking-header-add-modal-controller'

const ParkingHeaderAddModal = (props) => {
    const {
        showModalAdd
        , setShowModalAdd
        , setRefeshForm
        , setShowLoading
    } = props;
    const _timeStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _timeEnd = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cpm_id = authStore.cpm_id;
    const cartype_id = authStore.cartype_id;
    //--------------------------State
    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [parkingPrice, setParkingPrice] = useState("0");

    const [timeStart, setTimeStart] = useState(_timeStart);
    const [timeEnd, setTimeEnd] = useState(_timeEnd);
    const [hoursFree, setHoursFree] = useState("0");
    const [minutesFree, setMinutesFree] = useState("0");
    const [secondsFree, setSecondsFree] = useState(0);
    //----------------------Combobox value

    const [priority, setPriority] = useState("FIRST");
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            let isNotAuth;
            document.body.style.cursor = "wait";
            const searchObj = {
                cpm_id
            }
            getParkingHeaderCheckPriority({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        setPriority(res.result.priority_no);
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page500");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                    setRefeshForm(false);
                    setShowLoading(false)
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }, []);
    //--------------------------Close Modal
    function closeModal(event) {
        setShowModalAdd(false);
        setRefeshForm(true);
    }

    function addParkingHeader() {
        if (!addParkingHeaderMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);

        const values = {
            authStore
            , valuesObj: {
                cpm_id,
                cartype_id,
                name_th: nameTh,
                name_en: nameEn,
                interval_every: `${hoursFree}:${minutesFree}:${secondsFree}`,
                amount_value_for_cal: parkingPrice,
                start_time_zone: moment(timeStart).format("HH:mm:ss"),
                stop_time_zone: moment(timeEnd).format("HH:mm:ss"),
                priority_no: priority
            }
        }
        let isNotAuth;
        addParkingHeaderConfig(values).then(res => {
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
                    text: "เพิ่ม Zone Rate เรียบร้อย",
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
    function addParkingHeaderMiddleware() {
        if (!nameTh && !nameEn) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกชื่อ Zone Rate',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!hoursFree) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกจำนวณชั่วโมง',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!minutesFree) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกจำนวณนาที',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (parseInt(minutesFree) < 30 && parseInt(hoursFree) === 0) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกช่วงเวลาที่ใช้ในการคำนวณ',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (priority.toUpperCase() === "SECOND") {
            if (moment(timeStart).format("HH:mm:ss") == moment(timeEnd).format("HH:mm:ss")) {
                swal({
                    title: "Warning.",
                    text: 'Time zone start ห้ามเท่ากับ Time zone end',
                    icon: "warning",
                    button: "OK",
                });
                return false;
            }
        }
        return true;
    }
    // //-----------------Date Handing
    // function handdingDateStart(date) {
    //     if (moment(date) > moment(dateEnd)) {
    //         const newMoment = moment(date).add(1, 'days')
    //         setDateStart(date)
    //         setDateEnd(newMoment)
    //     }
    //     else
    //         setDateStart(date)
    // }
    // function handdingDateEnd(date) {
    //     if (moment(date) < moment(dateStart)) {
    //         const newMoment = moment(date).subtract(1, 'days')
    //         setDateStart(newMoment)
    //         setDateEnd(date);
    //     }
    //     else
    //         setDateEnd(date)
    // }

    //----------------Handle time
    function handleTimeStart(time) {
        if (moment(time) > moment(timeEnd)) {
            swal("Warning!", "Zone Start ห้ามมากกว่า Zone Stop", "warning");
            setTimeStart(moment(timeStart))
        }
        else
            setTimeStart(time)
    }
    function handleTimeEnd(time) {
        if (moment(time) < moment(timeStart)) {
            swal("Warning!", "Zone Stop ห้ามน้อยกว่า Zone Start", "warning");
            setTimeEnd(moment(timeEnd))
        }
        else
            setTimeEnd(time)
    }
    //----------------if select day type is special day
    let timeSelectElem = null;
    if (priority === "SECOND") {
        timeSelectElem = <CRow>
            <CCol xs="12" sm="6" md="6">
                <TimeMaterialUi
                    title="Time zone start"
                    selectedDate={timeStart}
                    setSelectedDate={handleTimeStart}
                />
            </CCol>
            <CCol xs="12" sm="6" md="6">
                <TimeMaterialUi
                    title="Time zone stop"
                    selectedDate={timeEnd}
                    setSelectedDate={handleTimeEnd}
                />
            </CCol>
        </CRow>
    } else {
        timeSelectElem = null;
    }

    return (
        <CModal
            show={showModalAdd}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>ทำรายการสร้าง Zone Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ชื่อ Zone Rate (ไทย)"
                                text={nameTh}
                                setText={setNameTh}
                                placeholder="Enter Zone Rate Name (Thai)"
                                maxLenght={255}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ชื่อ Zone Rate (Eng)"
                                text={nameEn}
                                setText={setNameEn}
                                placeholder="Enter Zone Rate Name (Eng)"
                                maxLenght={255}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <CLabel>ช่วงเวลาที่ใช้ในการคำนวณค่าจอด</CLabel>
                            <span style={{ color: "red" }}> เช่น คำนวณทุกๆ 1 ชั่วโมง เป็นต้น</span>
                            <CCard>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": ชั่วโมง"
                                                text={hoursFree}
                                                setText={setHoursFree}
                                                placeholder="Hours"
                                                maxLenght={5}
                                            />
                                        </CCol>
                                        <CCol xs="12" sm="3" md="3">
                                            <InputNumberEnable
                                                title=": นาที"
                                                text={minutesFree}
                                                setText={setMinutesFree}
                                                placeholder="Minutes"
                                                maxLenght={2}
                                            />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    {timeSelectElem}
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputNumberEnable
                                title="ค่าบริการจอดรถ (บาท/หน่วย)"
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
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="success" onClick={addParkingHeader}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParkingHeaderAddModal