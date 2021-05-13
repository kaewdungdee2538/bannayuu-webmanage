import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CLabel,
    CInput,
    CInputCheckbox,
    CFormGroup,
} from '@coreui/react'
import { OuanIconForBtn } from '../../../../containers/function/OuanIcon'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../main/Parking-main.css'
import './Parking-master.css'
import swal from 'sweetalert';
import CIcon from '@coreui/icons-react'
import store, { disAuthenticationLogin, selectCPM, unSelectCPM } from '../../../../store'
import InputDisable from '../../component/input/InputDisable'
import InputEnable from '../../component/input/InputEnable'
import InputNumberEnable from '../../component/input/InputNumberEnable'
import { getParkingMasterById, 
    editParkingMasterByCPMID,
    disableParkingMasterByCPMID
 } from './Parking-master-edit-controller'
import TextAreaDisable from '../../component/textarea/TextAreaDisable'
import TextArea from '../../component/textarea/TextArea'
import moment from 'moment'
import ComboBoxSearchItem from '../../component/combobox/ComboBoxSearchItem'
import {
    comboBoxItemForDayTypesArr, getDayTypeId, getDayTypeName
    , getOverNightStatusId, getOverNightStatusName, comboBoxItemForOverNightStatusArr
    , convertDayTypeIdToDayTypeKeyString, convertOverNightStatusIdToOverNightStatusKeyString
} from '../data/parking-data'
import TimeMaterialUi from '../../component/time/TimeMaterialUi'
import DateMaterialUi from '../../component/datetime/DateMaterialUi'
function ParkingMasterEdit(props) {
    const _timeStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _timeEnd = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cpm_id = authStore.cpm_id;
    //------------------Props
    const { setShowLoading
        , setShowMasterForm
        , setShowHeaderForm
        , setShowMasterEditForm
    } = props;
    //------------------State
    const [parkingMasterObj, setParkingMasterObj] = useState({
        cpm_id: "",
        cpm_code: "",
        cpm_name_th: "",
        cpm_name_en: "",
        cartype_id: 0,
        cartype_name_th: "",
        cpm_start_date: null,
        cpm_stop_date: null,
        cpm_day_type: "SPECIAL",
        cpm_time_for_free: "00:00:00",
        cpm_overnight_status: "N",
        cpm_overnight_start: "00:00:00",
        cpm_overnight_stop: "00:00:00",
        cpm_fine_amount: 0,
        cpm_remark: null,
        create_by: null,
        create_date: null,
        update_by: null,
        update_date: null,
        company_name: ""
    });
    const [resfeshForm, setRefeshForm] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    //---------------------Values
    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [remark, setRemark] = useState("");
    const [overNightFine, setOverNightFine] = useState(0);

    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [timeStart, setTimeStart] = useState(_timeStart);
    const [timeEnd, setTimeEnd] = useState(_timeEnd);
    const [hoursFree, setHoursFree] = useState(0);
    const [minutesFree, setMinutesFree] = useState(0);
    const [secondsFree, setSecondsFree] = useState(0);
    //----------------------Combobox value
    const [dayTypeStatus, setDayTypeStatus] = useState({ id: 0, value: "เลือกประเภทวัน" })
    const [overNightStatus, setOverNightStatus] = useState({ id: 0, value: "เลือกการเสียค่าปรับค้างคืน" })
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
        document.body.style.cursor = "wait";
        const searchObj = {
            cpm_id
        }
        getParkingMasterById({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    const result = res.result;
                    setParkingMasterObj(result);
                    setNameTh(result.cpm_name_th)
                    setNameEn(result.cpm_name_en)
                    const cpmStart = result.cpm_start_date ? moment(result.cpm_start_date) : null;
                    const cpmEnd = result.cpm_stop_date ? moment(result.cpm_stop_date) : null;
                    setDateStart(cpmStart)
                    setDateEnd(cpmEnd)
                    const overNightStart = result.cpm_overnight_start ? moment(result.cpm_overnight_start, "HH:mm:ss") : _timeStart;
                    const overNightEnd = result.cpm_overnight_stop ? moment(result.cpm_overnight_stop, "HH:mm:ss") : _timeEnd;
                    setTimeStart(overNightStart);
                    setTimeEnd(overNightEnd);
                    setRemark(result.cpm_remark)
                    setDayTypeStatus({ id: getDayTypeId(result.cpm_day_type), value: getDayTypeName(result.cpm_day_type) })
                    setOverNightStatus({ id: getOverNightStatusId(result.cpm_overnight_status), value: getOverNightStatusName(result.cpm_overnight_status) })
                    setOverNightFine(result.cpm_fine_amount);
                    const timeFreeMoment = moment(result.cpm_time_for_free, "HH:mm:ss");
                    setHoursFree(timeFreeMoment.hour());
                    setMinutesFree(timeFreeMoment.minute());
                    setSecondsFree(timeFreeMoment.second());
                    const cartype_id = result.cartype_id;
                    store.dispatch(selectCPM({
                        cpm_id, cartype_id,
                        cpm_name_th: result.cpm_name_th,
                        cpm_name_en: result.cpm_name_en,
                        cartype_name_th: result.cartype_name_th,
                        cpm_day_type: result.cpm_day_type
                    }));
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
                setShowLoading(false);
                setEditInfo(false);
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
    //----------------On back click
    function onBackClick(event) {
        setShowMasterEditForm(false);
        setShowMasterForm(true);
        store.dispatch(unSelectCPM());
    }
    //-----------------On edit click
    function onEditClick(event) {
        if (editInfo) setEditInfo(false);
        else setEditInfo(true);
    }
    //-----------------On save edit click
    function onEditSaveClick(event) {
        if (!editSaveMiddleware())
            return;
        setShowLoading(true);
        const getDayTypeStatus = convertDayTypeIdToDayTypeKeyString(dayTypeStatus.id);
        const getOverNightStatus = convertOverNightStatusIdToOverNightStatusKeyString(overNightStatus.id);
        const values = {
            authStore
            , valueObj: {
                cpm_id: parkingMasterObj.cpm_id
                , name_th: nameTh
                , name_en: nameEn
                , cartype_id: parkingMasterObj.cartype_id
                , start_date: getDayTypeStatus === 'SPECIAL' ? moment(dateStart).format("YYYY-MM-DD") : null
                , stop_date: getDayTypeStatus === 'SPECIAL' ? moment(dateEnd).format("YYYY-MM-DD") : null
                , cpm_day_type: getDayTypeStatus
                , cpm_time_for_free: `${hoursFree}:${minutesFree}:${secondsFree}`
                , cpm_overnight_status: getOverNightStatus
                , overnight_start: moment(timeStart).format("HH:mm:ss")
                , overnight_stop: moment(timeEnd).format("HH:mm:ss")
                , cpm_fine_amount: overNightFine
                , remark
            }
        }
        let isNotAuth;
        editParkingMasterByCPMID(values)
            .then(res => {
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
                        text: "แก้ไข Master rate config เรียบร้อย",
                        icon: "success",
                        button: "OK",
                    });
                    setRefeshForm(true)
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
    //-----------------Middleware
    function editSaveMiddleware() {
        if (dayTypeStatus.id == 2) {
            if (!dateStart) {
                swal({
                    title: "Warning.",
                    text: 'กรุณาเลือกช่วงวันที่เริ่มคำนวณพิเศษ',
                    icon: "warning",
                    button: "OK",
                });
                return false;
            } else if (!dateEnd) {
                swal({
                    title: "Warning.",
                    text: 'กรุณาเลือกช่วงวันที่สิ้นสุดคำนวณพิเศษ',
                    icon: "warning",
                    button: "OK",
                });
                return false;
            }
        }
        return true;
    }
    //-----------------On show header fron click
    function onNextToHeaderClick() {
        setShowHeaderForm(true);
        setShowMasterEditForm(false);
        setShowMasterForm(false);
    }
    //-----------------Date Handing
    function handdingDateStart(date) {
        if (moment(date) > moment(dateEnd)) {
            const newMoment = moment(date).add(1, 'days')
            setDateStart(date)
            setDateEnd(newMoment)
        }
        else
            setDateStart(date)
    }
    function handdingDateEnd(date) {
        if (moment(date) < moment(dateStart)) {
            const newMoment = moment(date).subtract(1, 'days')
            setDateStart(newMoment)
            setDateEnd(date);
        }
        else
            setDateEnd(date)
    }
    //----------------ComboBox
    let comboBoxDayTypeArrayElem = null;
    if (comboBoxItemForDayTypesArr.length > 0) {
        comboBoxDayTypeArrayElem = <ComboBoxSearchItem
            key={1}
            title="ประเภทวันของการคำนวณ ?"
            text={dayTypeStatus}
            placeholder="Enter daytype"
            itemsArray={comboBoxItemForDayTypesArr}
            setText={setDayTypeStatus}
        />
    }
    let comboBoxOverNightArrayElem = null;
    if (comboBoxItemForDayTypesArr.length > 0) {
        comboBoxOverNightArrayElem = <ComboBoxSearchItem
            key={2}
            title="เก็บค่าปรับค้างคืน ?"
            text={overNightStatus}
            placeholder="Enter status"
            itemsArray={comboBoxItemForOverNightStatusArr}
            setText={setOverNightStatus}
        />
    }
    //----------------On disable click
    function onDisableClick() {
        swal("หมายเหตุ:", {
            content: "input",
        })
            .then((value) => {
                if (!value)
                    swal({
                        title: "Warning.",
                        text: `กรุณากรอกหมายเหตุ`,
                        icon: "warning",
                        button: "OK",
                    });
                else swal({
                    title: "Are you sure?",
                    text: "ต้องการลบ Master หรือไม่!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        disableSaveClick(value);
                    }
                });
            });
    }
    function disableSaveClick(remarkInput) {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                cpm_id
                , remark: remarkInput
            }
        }
        let isNotAuth;
        disableParkingMasterByCPMID(values).then(res => {
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
                    text: "ลบ Master เรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setShowMasterEditForm(false);
                setShowMasterForm(true);
                store.dispatch(unSelectCPM());
                setRefeshForm(true);
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
    //----------------if select day type is special day
    let dateSelectDayTypeElem = null;
    if (dayTypeStatus.id == 2) {
        dateSelectDayTypeElem = <div>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <DateMaterialUi
                        title="ช่วงวันที่เริ่มคำนวณพิเศษ"
                        selectedDate={dateStart}
                        setSelectedDate={handdingDateStart}
                    />
                </CCol>
                <CCol xs="12" sm="6" md="6">
                    <DateMaterialUi
                        title="ช่วงวันที่สิ้นสุดคำนวณพิเศษ"
                        selectedDate={dateEnd}
                        setSelectedDate={handdingDateEnd}
                    />
                </CCol>
            </CRow>
        </div>
    } else dateSelectDayTypeElem = null;
    if (overNightStatus.id == 1) {

    }
    //----------------Edit Form
    let editFormElem = null;
    let btnEditElem = null;
    if (editInfo) {
        //=========================================================
        btnEditElem = <div className="modal-footer">
            <div className="modal-footer-item">
                <CButton className="btn-class btn-modal-footer"
                    color="danger"
                    onClick={onDisableClick}
                >
                    <CIcon
                        name="cil-ban"
                        color="info" />
                    <span className="btn-icon-footer">ลบค่าบริการ</span>
                </CButton>
            </div>
            <div className="modal-footer-item">
                <CButton
                    onClick={onEditSaveClick}
                    className="btn-class"
                    color="success">
                    {/* <CIcon
                    cpm_id={item.cpm_id}
                    cpm_code={item.cpm_code}
                    name="cil-magnifying-glass"
                    color="info" /> */}
                    <span
                        className="btn-icon">บันทึก</span></CButton>
            </div>
        </div>
        //=========================================================
        editFormElem = <div>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <InputEnable
                        title="ชื่อ Master Rate (ไทย)"
                        text={nameTh}
                        setText={setNameTh}
                        placeholder="Enter Master Rate Name (Thai)"
                        maxLenght={255}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <InputEnable
                        title="ชื่อ Master Rate (Eng)"
                        text={nameEn}
                        setText={setNameEn}
                        placeholder="Enter Master Rate Name (Eng)"
                        maxLenght={255}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <CLabel>เวลาจอดฟรี</CLabel>
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
                                <CCol xs="12" sm="3" md="3">
                                    <InputNumberEnable
                                        title=": วินาที"
                                        text={secondsFree}
                                        setText={setSecondsFree}
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
                <CCol xs="12" sm="5" md="4">
                    {comboBoxDayTypeArrayElem}
                </CCol>
            </CRow>
            {dateSelectDayTypeElem}
            <CRow>
                <CCol xs="12" sm="5" md="4">
                    {comboBoxOverNightArrayElem}
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <TimeMaterialUi
                        title="ช่วงเวลาที่เริ่มปรับค้างคืน"
                        selectedDate={timeStart}
                        setSelectedDate={setTimeStart}
                    />
                </CCol>
                <CCol xs="12" sm="6" md="6">
                    <TimeMaterialUi
                        title="ช่วงเวลาที่สิ้นสุดปรับค้างคืน"
                        selectedDate={timeEnd}
                        setSelectedDate={setTimeEnd}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputNumberEnable
                        title="ค่าปรับค้างคืน (บาท)"
                        text={overNightFine}
                        setText={setOverNightFine}
                        placeholder="Enter Over Night Fine"
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
        </div>
    } else {
        btnEditElem = null;
        editFormElem = <div>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <InputDisable
                        title="ชื่อ Master Rate (ไทย)"
                        text={parkingMasterObj.cpm_name_th}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <InputDisable
                        title="ชื่อ Master Rate (Eng)"
                        text={parkingMasterObj.cpm_name_en}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="เวลาจอดฟรี"
                        text={parkingMasterObj.cpm_time_for_free}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ประเภทวันของการคำนวณ"
                        text={getDayTypeName(parkingMasterObj.cpm_day_type)}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ช่วงวันที่เริ่มคำนวณพิเศษ"
                        text={parkingMasterObj.cpm_start_date}
                    />
                </CCol>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ช่วงวันที่สิ้นสุดคำนวณพิเศษ"
                        text={parkingMasterObj.cpm_stop_date}
                    />
                </CCol>
            </CRow>

            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="เก็บค่าปรับค้างคืน"
                        text={getOverNightStatusName(parkingMasterObj.cpm_overnight_status)}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ช่วงเวลาที่เริ่มปรับค้างคืน"
                        text={parkingMasterObj.cpm_overnight_start}
                    />
                </CCol>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ช่วงเวลาที่สิ้นสุดปรับค้างคืน"
                        text={parkingMasterObj.cpm_overnight_stop}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="6" md="6">
                    <InputDisable
                        title="ค่าปรับค้างคืน (บาท)"
                        text={parkingMasterObj.cpm_fine_amount}
                    />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <TextAreaDisable
                        title="หมายเหตุ"
                        row={3}
                        text={parkingMasterObj.cpm_remark}
                    />
                </CCol>
            </CRow>
        </div>
    }
    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            <div className="form-goto-header">
                <div></div>
                <CButton
                    className="btn-goto-header-form"
                    onClick={onNextToHeaderClick}
                >
                    <span className="item-btn-goto-header-form">ไปที่หน้า Parking Zone Configuration</span>
                    <div className="item-btn-goto-header-form"><OuanIconForBtn name="FaChevronCircleRight" /></div>
                </CButton>
            </div>
            <br></br>
            <CCard>
                <CCardHeader className="head-card-form card-header-cpm">
                    <div>Parking Master Setting</div>
                    <div>
                        <CFormGroup variant="custom-checkbox" inline >
                            <CInputCheckbox custom id="inline-checkbox2" name="inline-checkbox2"
                                className="check-box-edit"
                                checked={editInfo}
                                onChange={onEditClick} />
                            <CLabel
                                variant="custom-checkbox"
                                htmlFor="inline-checkbox2"
                                className="check-box-edit"
                            >แก้ไข</CLabel>
                        </CFormGroup>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={parkingMasterObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="ประเภทรถ"
                                text={parkingMasterObj.cartype_name_th}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="Master code"
                                text={parkingMasterObj.cpm_code}
                            />
                        </CCol>
                    </CRow>
                    {editFormElem}
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="สร้างโดย"
                                text={parkingMasterObj.create_by}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="เวลาที่สร้าง"
                                text={parkingMasterObj.create_date}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="แก้ไขโดย"
                                text={parkingMasterObj.update_by}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="เวลาที่แก้ไข"
                                text={parkingMasterObj.update_date}
                            />
                        </CCol>
                    </CRow>
                    <br></br>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <div className="btn-save-footer">
                                <div></div>
                                {btnEditElem}
                            </div>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CButton
                onClick={onBackClick}
                className="btn-class btn-back"
                color="warning">
                <span
                    className="btn-icon">ย้อนกลับ</span></CButton>
        </CCol>
    )
}

export default ParkingMasterEdit;