import './Complaint-success-main.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import { ComplaintSuccessMainController } from './Complaint-success-main-controller'
import ComplaintSuccessModal from '../modal/Complaint-success-modal'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import InputEnable from '../../../component/input/InputEnable'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'

const getBadge = status => {
    switch (status) {
        case 'N': return 'secondary'
        case 'REJECT': return 'danger'
        case 'RECEIPT': return 'warning'
        case 'CANCEL': return 'dark'
        default: return 'success'
    }
}
const getStatus = status => {
    switch (status) {
        case 'N': return 'ยังไม่ได้ตรวจสอบ'
        case 'REJECT': return 'ปฏิเสธคำร้อง'
        case 'RECEIPT': return 'กำลังดำเนินการ'
        case 'CANCEL': return 'ยกเลิกดำเนินการ'
        default: return 'ดำเนินการเรียบร้อย'
    }
}
const fields = ['แสดง', 'ที่อยู่', 'หัวข้อ', 'วันที่', 'สถานะ',]

function ComplaintSuccessMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [complaintObj, setComplaintObj] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        hci_id: "", hci_code: ""
    });
    const [refeshForm, setRefeshForm] = useState(false);
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [address, setAddress] = useState('');
    const [headerText, setHeaderText] = useState('')
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
        refeshFormFunc(true);
        setRefeshForm(false);
    }
    function refeshFormFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true)
            let isNotAuth;
            document.body.style.cursor = "wait";
            const searchObj = {
                address: reset ? null : address,
                headerText: reset ? null : headerText,
                start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
                end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
            }
            ComplaintSuccessMainController({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setComplaintObj(result);
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
    let complatintModal = null;
    if (showModal) {
        complatintModal = <ComplaintSuccessModal
            hci_id={selectedObj.hci_id}
            hci_code={selectedObj.hci_code}
            showModal={showModal}
            setShowModal={setShowModal}
            setShowLoading={setShowLoading}
        />
    } else complatintModal = null;
    //------------------on click show modal
    function onClickShowModal(event) {
        const hci_id = event.target.getAttribute("hci_id")
        const hci_code = event.target.getAttribute("hci_code")
        setSelectedObj({ hci_id, hci_code })
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
            {complatintModal}
            <CCardHeader className="form-head-complaint">ประวัติการร้องเรียน</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Complaint History Table
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
                                <CCol xs="12" sm="4" md="4">
                                    <InputEnable
                                        title="ที่อยู่"
                                        placeholder="Enter home number"
                                        maxLength="30"
                                        text={address}
                                        setText={setAddress}
                                    />
                                </CCol>
                                <CCol xs="12" sm="8" md="8">
                                    <InputEnable
                                        title="หัวข้อร้องเรียน"
                                        placeholder="Enter header"
                                        maxLength="250"
                                        text={headerText}
                                        setText={setHeaderText}
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
                                items={complaintObj}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'แสดง':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    hci_id={item.hci_id}
                                                    hci_code={item.hci_code}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-management"
                                                    color="info">
                                                    <CIcon
                                                        hci_id={item.hci_id}
                                                        hci_code={item.hci_code}
                                                        name="cil-magnifying-glass"
                                                        color="info" />
                                                    <span
                                                        hci_id={item.hci_id}
                                                        hci_code={item.hci_code}
                                                        className="btn-icon">แสดง</span></CButton>
                                            </td>
                                        ),
                                    'ที่อยู่': (item) => (
                                        <td>
                                            <span>
                                                {item.home_address}
                                            </span>
                                        </td>
                                    ), 'หัวข้อ': (item) => (
                                        <td>
                                            <span> {item.hci_header_text}</span>
                                        </td>
                                    )
                                    , 'วันที่': (item) => (
                                        <td>
                                            <span> {item.post_date}</span>
                                        </td>
                                    ), 'สถานะ': (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.hci_status)}>
                                                {getStatus(item.hci_status)}
                                            </CBadge>
                                        </td>
                                    )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody >
        </CCard >
    )
}

export default ComplaintSuccessMain;