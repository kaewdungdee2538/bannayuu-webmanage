import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
    CLabel,
    CFormGroup,
    CInputCheckbox,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../main/Parking-main.css'
import './Parking-header.css'
import store, { disAuthenticationLogin, unSelectCPH } from '../../../../store'
import swal from 'sweetalert';
import moment from 'moment'
import { fieldsHeader } from '../data/parking-data'
import { getBadgeCph, getTextStatusCph } from '../data/parking-data'
import { getParkingHeaderByCPHID, editParkingHeaderByCPHID } from './Parking-header-controller'
import InputDisable from '../../component/input/InputDisable'
import InputEnable from '../../component/input/InputEnable'
import TimeMaterialUi from '../../component/time/TimeMaterialUi'
import InputNumberEnable from '../../component/input/InputNumberEnable'
import TextArea from '../../component/textarea/TextArea'
import ParkingSubTable from '../sub/Parking-sub-table'

function ParkingHeaderInfo(props) {
    const _timeStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _timeEnd = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cph_id = authStore.cph_id;
    //------------------Props
    const { setShowLoading
        , setShowParkingHeaderTable
        , setShowParkingHeaderInfo
    } = props;

    //--------------State
    const [resfeshForm, setRefeshForm] = useState(false);
    const [parkingHeaderInfo, setParkingHeaderInfo] = useState({
        cph_id: "",
        cph_code: "",
        cpm_id: "",
        cph_name_th: "",
        cph_name_en: "",
        time_zone_start: "00:00:00",
        time_zone_stop: "00:00:00",
        cph_cal_every_interval: {
            hours: 0,
            minutes: 0
        },
        cph_cal_amount_value: 0,
        cph_status: "",
        create_by: "",
        create_date: "",
        update_by: "",
        update_date: "",
        cpm_name_th: "",
        cpm_name_en: "",
        cartype_name_th: "",
        company_name: ""
    });
    const [headerInfoEdit, setHeaderInfoEdit] = useState(false);

    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [remark, setRemark] = useState("");
    const [timeStart, setTimeStart] = useState(_timeStart);
    const [timeEnd, setTimeEnd] = useState(_timeEnd);
    const [hoursFree, setHoursFree] = useState("0");
    const [minutesFree, setMinutesFree] = useState("0");
    const [secondsFree, setSecondsFree] = useState("0");
    const [parkingService, setParkingService] = useState("0")
    const [priority, setPriority] = useState("FIRST");
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm() {
        let isNotAuth;
        if (!cph_id) {
            swal("Warning!", "ไม่พบ cph id กรุณาเลือกรายการใหม่", "warning");
            onBackClick();
        }
        document.body.style.cursor = "wait";
        const searchObj = {
            cph_id
        }
        getParkingHeaderByCPHID({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    const result = res.result
                    setParkingHeaderInfo(result);
                    setParkingService(result.cph_cal_amount_value)
                    setNameTh(result.cph_name_th);
                    setNameEn(result.cph_name_th);
                    setRemark(result.remark);
                    setTimeStart(moment(result.time_zone_start, "HH:mm:ss"));
                    setTimeEnd(moment(result.time_zone_stop, "HH:mm:ss"));
                    const everyTimeForCal = moment(result.cph_cal_every_interval, "HH:mm:ss");
                    setHoursFree(everyTimeForCal.hour().toString());
                    setMinutesFree(everyTimeForCal.minute().toString());
                    setSecondsFree(everyTimeForCal.second());
                    setPriority(result.priority_no);
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
    if (resfeshForm) {
        refeshForm();
    }

    //---------------Show edit form
    function onEditClick(event) {
        if (headerInfoEdit) setHeaderInfoEdit(false);
        else setHeaderInfoEdit(true);
    }

    //----------------On Back Click
    function onBackClick(event) {
        setShowParkingHeaderInfo(false);
        setShowParkingHeaderTable(true);
        store.dispatch(unSelectCPH());
    }
    //----------------On save Edit
    function onEditSaveClick(event) {
        if (!addParkingHeaderMiddleware()) return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                priority_no: priority
                , cpm_id: parkingHeaderInfo.cpm_id
                , cph_id: parkingHeaderInfo.cph_id
                , cartype_id: parkingHeaderInfo.cartype_id
                , name_th: nameTh
                , name_en: nameEn
                , interval_every: `${hoursFree}:${minutesFree}:${secondsFree}`
                , amount_value_for_cal: parkingService
                , remark
                , start_time_zone: moment(timeStart).format("HH:mm:ss")
                , stop_time_zone: moment(timeEnd).format("HH:mm:ss")
            }
        }
        let isNotAuth;
        editParkingHeaderByCPHID(values).then(res => {
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
                setRefeshForm(true);
                setHeaderInfoEdit(false);
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
        if (!remark) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกหมายเหตุ',
                icon: "warning",
                button: "OK",
            });
            return false;
        }
        return true;
    }
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
    //----------------Show Time zone select
    let timeZoneSelectElem = null;
    if (priority.toUpperCase() === "SECOND") {
        timeZoneSelectElem = <CRow>
            <CCol xs="12" sm="6" md="6">
                <TimeMaterialUi
                    title="Start zone"
                    selectedDate={timeStart}
                    setSelectedDate={handleTimeStart}
                />
            </CCol>
            <CCol xs="12" sm="6" md="6">
                <TimeMaterialUi
                    title="Stop zone"
                    selectedDate={timeEnd}
                    setSelectedDate={handleTimeEnd}
                />
            </CCol>
        </CRow>
    } else timeZoneSelectElem = null;
    //----------------Show Edit Form
    let headerInfoFormElem = null;
    if (headerInfoEdit) {
        headerInfoFormElem =
            <CCol xs="12" lg="12">
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
                {timeZoneSelectElem}
                <br></br>
                <CRow>
                    <CCol xs="12" sm="12" md="12">
                        <CLabel>ช่วงเวลาที่ใช้ในการคำนวณค่าจอด</CLabel>
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
                <CRow>
                    <CCol xs="12" sm="6" md="6">
                        <InputNumberEnable
                            title="ค่าบริการจอดรถ (บาท/หน่วย)"
                            text={parkingService}
                            setText={setParkingService}
                            placeholder="Enter parking service"
                            maxLenght={4}
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" sm="12" md="12">
                        <TextArea
                            title="หมายเหตุ"
                            row={3}
                            text={remark}
                            setText={setRemark}
                            placeholder="Enter Remark"
                            maxLenght={255}
                        />
                    </CCol>
                </CRow>
                <br></br>
                <div className="btn-header-info-edit-form">
                    <div></div>
                    <CButton
                        onClick={onEditSaveClick}
                        className="btn-class btn-edit"
                        color="success">
                        {/* <CIcon
                    cpm_id={item.cpm_id}
                    cpm_code={item.cpm_code}
                    name="cil-magnifying-glass"
                    color="info" /> */}
                        <span
                            className="btn-icon">บันทึก</span></CButton>
                </div>

            </CCol>
    } else {
        headerInfoFormElem =
            <CCol xs="12" lg="12">
                <CRow>
                    <CCol xs="12" sm="12" md="12">
                        <InputDisable
                            title="ชื่อ Zone Rate (ไทย)"
                            text={parkingHeaderInfo.cph_name_th}
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" sm="12" md="12">
                        <InputDisable
                            title="ชื่อ Zone Rate (Eng)"
                            text={parkingHeaderInfo.cph_name_th}
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" sm="6" md="6">
                        <InputDisable
                            title="Start zone"
                            text={parkingHeaderInfo.time_zone_start}
                        />
                    </CCol>
                    <CCol xs="12" sm="6" md="6">
                        <InputDisable
                            title="Stop zone"
                            text={parkingHeaderInfo.time_zone_stop}
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12" sm="6" md="6">
                        <InputDisable
                            title="ช่วงเวลาที่ใช้ในการคำนวณค่าจอด"
                            text={parkingHeaderInfo.cph_cal_every_interval}
                        />
                    </CCol>
                    <CCol xs="12" sm="6" md="6">
                        <InputDisable
                            title="ค่าบริการจอดรถ (บาท/หน่วย)"
                            text={parkingHeaderInfo.cph_cal_amount_value}
                        />
                    </CCol>
                </CRow>
            </CCol>
    }
    //----------------Show parking sub Form
    let parkingSubListElem = null;
    {
        parkingSubListElem = <ParkingSubTable
            setShowLoading={setShowLoading}
        />

    }
    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            <CCard>
                <div className="checkbox-header-info">
                    <div></div>
                    <CFormGroup variant="custom-checkbox" inline >
                        <CInputCheckbox custom id="inline-checkbox2" name="inline-checkbox2"
                            className="check-box-edit"
                            checked={headerInfoEdit}
                            onChange={onEditClick} />
                        <CLabel
                            variant="custom-checkbox"
                            htmlFor="inline-checkbox2"
                            className="check-box-edit"
                        >แก้ไข</CLabel>
                    </CFormGroup>
                </div>
                <CCardBody>
                    {headerInfoFormElem}
                </CCardBody>
            </CCard>
            <hr></hr>
            <h3>ตารางค่าบริการจอดรถ</h3>
                <CCardBody>
                    {parkingSubListElem}
                </CCardBody>
            
            <CButton
                onClick={onBackClick}
                className="btn-class btn-back"
                color="danger">
                <span
                    className="btn-icon">ย้อนกลับ</span></CButton>
        </CCol>
    )
}

export default ParkingHeaderInfo;