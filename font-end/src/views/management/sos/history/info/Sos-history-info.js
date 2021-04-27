import './Sos-history-info.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
    CLabel
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import { SosHistoryController } from './Sos-history-info-controller'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import InputEnable from '../../../component/input/InputEnable'
import SelectBox from '../../../component/selectbox/SelectBox'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import {getBadge,getStatus,fields,selectBoxItems} from '../data/sos-history-data'
import SosHistoryModal from '../modal/Sos-modal-history'
function SosHistoryInfo() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [parcelObj, setParcelObj] = useState(null)
    const [showSosModal, setShowSosModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        sos_id: ""
    });
    const [selectBoxObj,setSelectBoxObj] = useState({
        value:"",type:""
    })
    const [refeshForm, setRefeshForm] = useState(false);
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [address, setAddress] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //---------------Form load
    useEffect(() => {
        refeshFormFunc();
    }, [])
    //-----------------Refesh Form
    if (refeshForm) {
        refeshFormFunc();
        setRefeshForm(false);
    }
    function refeshFormFunc() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            const searchObj = {
                address,
                start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
                end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString(),
                status_type:selectBoxObj.value
            }
            SosHistoryController({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setParcelObj(result);
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error;
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page500");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                    setShowLoading(false);
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    
    //------------------on click show modal
    function onClickShowModal(event) {
        const sos_id = event.target.getAttribute("sos_id")
        setSelectedObj({ sos_id })
        setShowSosModal(true);
    }
    //-----------------Show Modal
    let showModal = null;
    if(showSosModal){
        showModal = <SosHistoryModal
        showSosModal={showSosModal}
        setShowSosModal={setShowSosModal}
        selectedObj={selectedObj}
        setShowLoading={setShowLoading}
        />
    }
    //-----------------Date Handing
    function handdingDateStart(event) {
        if (moment(event) > moment(dateTimeEnd)) {
            const newMoment = moment(event).add(1, 'h').format("YYYY-MM-DDTHH:mm")
            setDateTimeStart(event)
            setDateTimeEnd(newMoment)
        }
        else
            setDateTimeStart(event)
    }
    function handdingDateEnd(event) {
        if (moment(event) < moment(dateTimeStart)) {
            const newMoment = moment(event).subtract(1, 'h').format("YYYY-MM-DDTHH:mm")
            setDateTimeStart(newMoment)
            setDateTimeEnd(event);
        }
        else
            setDateTimeEnd(event)
    }
    //-----------------On Search Click
    async function onSearchClick(event) {
        if (await searchMiddleware())
            refeshFormFunc();
    }
    async function searchMiddleware() {
        if (dateTimeStart > dateTimeEnd) {
            swal("Warning!", "เวลาเริ่มต้น ห้ามมากกว่า เวลาสิ้นสุด", "warning");
            return false;
        }
        const timeStart = moment(dateTimeStart);
        const timeEnd = moment(dateTimeEnd);
        const time_diff = timeEnd - timeStart
        const getMonth = moment(time_diff).get('month')
        if (getMonth > 1) {
            swal("Warning!", "เลือกช่วงเวลาห้ามมากกว่า 1 เดือน", "warning");
            return false;
        }
        return true;
    }
    
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            {showModal}
            <CCardHeader className="form-head-parcel">ประวัติแจ้งเตือนฉุกเฉิน</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Sos History Table
                    </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <DatetimePickerInput
                                        title="จาก"
                                        text={dateTimeStart}
                                        setText={handdingDateStart}
                                    />
                                </CCol>
                                <CCol xs="12" sm="6" md="6">
                                    <DatetimePickerInput
                                        title="ถึง"
                                        text={dateTimeEnd}
                                        setText={handdingDateEnd}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <InputEnable
                                        title="ที่อยู่"
                                        placeholder="Enter home number"
                                        maxLength="30"
                                        text={address}
                                        setText={setAddress}
                                    />
                                </CCol>
                                <CCol xs="12" sm="6" md="6">
                                    <SelectBox
                                        title="สถานะ"
                                        items={selectBoxItems}
                                        name="status_type"
                                        setSelected={setSelectBoxObj}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <div className="head">
                                    <CCol xs="12">
                                        <CButton
                                            className="btn-class btn-head"
                                            color="info"
                                            onClick={onSearchClick}
                                        >
                                            <CIcon
                                                name="cil-magnifying-glass"
                                                color="info" />
                                            <span className="span-head">ค้นหา</span>
                                        </CButton>
                                    </CCol>
                                </div>
                            </CRow>
                            <br></br>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={parcelObj}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'แสดง':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    sos_id={item.sos_id}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-edit"
                                                    color="info">
                                                    <CIcon
                                                        sos_id={item.sos_id}
                                                        name="cil-magnifying-glass"
                                                        color="danger" />
                                                    <span
                                                        sos_id={item.sos_id}
                                                        className="btn-icon">ค้นหา</span></CButton>
                                            </td>
                                        ), 'ที่อยู่': (item) => (
                                            <td>
                                                <span>
                                                    {item.home_address}
                                                </span>
                                            </td>
                                        ), 'รายละเอียด': (item) => (
                                            <td>
                                                <span> {item.sos_detail_text}</span>
                                            </td>
                                        )
                                    , 'วันที่แจ้ง': (item) => (
                                        <td>
                                            <span> {item.sos_datetime}</span>
                                        </td>
                                    ), 'สถานะ': (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.sos_status)}>
                                                {getStatus(item.sos_status)}
                                            </CBadge>
                                        </td>
                                    )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>
        </CCard>
    )
}

export default SosHistoryInfo;