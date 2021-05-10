import React, { useState } from 'react'
import swal from 'sweetalert';
import './Parking-master-add-modal.css'
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
import DateMaterialUi from '../../../component/datetime/DateMaterialUi'
import store, { disAuthenticationLogin } from '../../../../../store'
import ComboBoxSearchItem from '../../../component/combobox/ComboBoxSearchItem'
import { comboBoxItemForDayTypesArr, comboBoxItemForOverNightStatusArr } from '../../data/parking-data'
import { addParkingMasterConfig } from './Parking-master-add-modal-controller'
import { convertDayTypeIdToDayTypeKeyString, convertOverNightStatusIdToOverNightStatusKeyString } from '../../data/parking-data'
const ParkingMasterAddModal = (props) => {
    const {
        showModalAdd
        , setShowModalAdd
        , setRefeshForm
        , cartypesInfoForCreateArr
        , setShowLoading
    } = props;
    const _timeStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _timeEnd = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _dateStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------------------State
    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [overNightFine, setOverNightFine] = useState(0);

    const [dateStart, setDateStart] = useState(_dateStart);
    const [dateEnd, setDateEnd] = useState(_dateEnd);
    const [timeStart, setTimeStart] = useState(_timeStart);
    const [timeEnd, setTimeEnd] = useState(_timeEnd);
    const [hoursFree, setHoursFree] = useState(0);
    const [minutesFree, setMinutesFree] = useState(0);
    const [secondsFree, setSecondsFree] = useState(0);
    //----------------------Combobox value
    const [carTypeStatus, setCarTypeStatus] = useState({ id: 0, value: "เลือกประเภทรถ" })
    const [dayTypeStatus, setDayTypeStatus] = useState({ id: 0, value: "เลือกประเภทวัน" })
    const [overNightStatus, setOverNightStatus] = useState({ id: 0, value: "เลือกการเสียค่าปรับค้างคืน" })

    //--------------------------Close Modal
    function closeModal(event) {
        setShowModalAdd(false);
        setRefeshForm(true);
    }

    function addParcelModal() {
        if (!addParcelMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const getDayTypeStatus = convertDayTypeIdToDayTypeKeyString(dayTypeStatus.id);
        const getOverNightStatus = convertOverNightStatusIdToOverNightStatusKeyString(overNightStatus.id);
        const values = {
            authStore
            , valuesObj: {
                cartype_id: carTypeStatus.id
                , cpm_ref_id: null
                , name_th: nameTh
                , name_en: nameEn
                , start_date: getDayTypeStatus === 'SPECIAL' ? moment(dateStart).format("YYYY-MM-DD") : null
                , stop_date: getDayTypeStatus === 'SPECIAL' ? moment(dateEnd).format("YYYY-MM-DD") : null
                , cpm_day_type: getDayTypeStatus
                , cpm_time_for_free: `${hoursFree}:${minutesFree}:${secondsFree}`
                , cpm_overnight_status: getOverNightStatus
                , overnight_start: moment(timeStart).format("HH:mm:ss")
                , overnight_stop: moment(timeEnd).format("HH:mm:ss")
                , cpm_fine_amount: overNightFine
            }
        }
        let isNotAuth;
        addParkingMasterConfig(values).then(res => {
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
                    text: "เพิ่ม Master Rate เรียบร้อย",
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
    function addParcelMiddleware() {

        if (carTypeStatus.id == 0) {
            swal({
                title: "Warning.",
                text: 'กรุณาเลือกประเภทรถ',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (dayTypeStatus.id == 0) {
            swal({
                title: "Warning.",
                text: 'กรุณาเลือกประเภทวันของการคำนวณ',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (overNightStatus.id == 0) {
            swal({
                title: "Warning.",
                text: 'กรุณาเลือกว่ามีค่าปรับค้างคืนหรือไม่ ?',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (dayTypeStatus.id == 2) {
            console.log(dateStart)
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
    let comboBoxCarTypeArrayElem = null;
    if (cartypesInfoForCreateArr.length > 0) {
        comboBoxCarTypeArrayElem = <ComboBoxSearchItem
            key={Date.now}
            title="ประเภทรถ"
            text={carTypeStatus}
            placeholder="Enter car type"
            itemsArray={cartypesInfoForCreateArr}
            setText={setCarTypeStatus}
        />
    }
    let comboBoxDayTypeArrayElem = null;
    if (comboBoxItemForDayTypesArr.length > 0) {
        comboBoxDayTypeArrayElem = <ComboBoxSearchItem
            key={Date.now}
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
            key={Date.now}
            title="เก็บค่าปรับค้างคืน ?"
            text={overNightStatus}
            placeholder="Enter status"
            itemsArray={comboBoxItemForOverNightStatusArr}
            setText={setOverNightStatus}
        />
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
    } else {
        dateSelectDayTypeElem = null;
    }
    if (overNightStatus.id == 1) {

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
                <CModalTitle>ทำรายการสร้าง Master Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
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
                            {comboBoxCarTypeArrayElem}
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
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div></div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="success" onClick={addParcelModal}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParkingMasterAddModal