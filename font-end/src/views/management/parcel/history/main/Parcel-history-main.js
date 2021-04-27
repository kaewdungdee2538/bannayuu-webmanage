import './Parcel-history-main.css'
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
import { ParcelHistoryMainController } from './Parcel-history-main-controller'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import InputEnable from '../../../component/input/InputEnable'
import SelectBox from '../../../component/selectbox/SelectBox'
import { getBadge, getStatus, selectBoxItem, fields } from '../data/parcel-history-data'
import ParcelHistoryModal from '../modal/Parcel-history-modal'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'

function ParcelHistoryMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [parcelObj, setParcelObj] = useState(null)

    const [showModal, setShowModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        hci_id: "", hci_code: ""
    });
    const [refeshForm, setRefeshForm] = useState(false);
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [address, setAddress] = useState('');
    const [headerText, setHeaderText] = useState('')
    const [selected, setSelected] = useState({
        value: "", type: ""
    })
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
            setShowLoading(true);
            document.body.style.cursor = "wait";
            const searchObj = {
                address,
                headerText,
                start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
                end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString(),
                status_type: selected.value
            }
            let isNotAuth;
            ParcelHistoryMainController({ authStore, searchObj })
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
    //-----------------Set Show Modal
    let parcelShowModal = null;
    if (showModal) {
        parcelShowModal = <ParcelHistoryModal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedObj={selectedObj}
            setShowLoading={setShowLoading}
        />
    } else parcelShowModal = null;
    //------------------on click show modal
    function onClickShowModal(event) {
        const tpi_id = event.target.getAttribute("tpi_id")
        const tpi_code = event.target.getAttribute("tpi_code")
        setSelectedObj({ tpi_id, tpi_code })
        setShowModal(true);
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
            {parcelShowModal}
            <CCardHeader className="form-head-parcel">ประวัติการรับ-ส่งพัสดุให้ลูกบ้าน</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Send Parcel History Table
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
                                        title="เลือกสถานะ"
                                        name="type-history"
                                        items={selectBoxItem}
                                        setSelected={setSelected}
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
                                                    tpi_id={item.tpi_id}
                                                    tpi_code={item.tpi_code}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-edit"
                                                    color="info">
                                                    <CIcon
                                                        tpi_id={item.tpi_id}
                                                        tpi_code={item.tpi_code}
                                                        name="cil-magnifying-glass"
                                                        color="danger" />
                                                    <span
                                                        tpi_id={item.tpi_id}
                                                        tpi_code={item.tpi_code}
                                                        className="btn-icon">แสดงประวัติ</span></CButton>
                                            </td>
                                        ), 'ที่อยู่': (item) => (
                                            <td>
                                                <span>
                                                    {item.home_address}
                                                </span>
                                            </td>
                                        ), 'รายละเอียด': (item) => (
                                            <td>
                                                <span> {item.tpi_title}</span>
                                            </td>
                                        )
                                    , 'วันที่รับพัสดุ': (item) => (
                                        <td>
                                            <span> {item.receive_parcel_datetime}</span>
                                        </td>
                                    ), 'สถานะ': (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.tpi_status)}>
                                                {getStatus(item.tpi_status)}
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
        </CCard >
    )
}

export default ParcelHistoryMain;