import './Complaint-not-approve-main.css'
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
import { ComplaintNotApproveMainController } from './Complaint-not-approve-main-controller'
import ComplaintNotApproveModal from '../modal/Complaint-not-approve-modal'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import InputEnable from '../../../component/input/InputEnable'
const getBadge = status => {
    switch (status) {
        case 'N': return 'secondary'
        default: return 'primary'
    }
}
const getStatus = status => {
    switch (status) {
        case 'N': return 'ยังไม่ได้ตรวจสอบ'
        default: return 'ตรวจสอบแล้ว'
    }
}
const fields = ['รับเรื่อง', 'ที่อยู่', 'หัวข้อ', 'วันที่', 'สถานะ',]

function ComplaintNotApproveMain() {
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
            document.body.style.cursor = "wait";
            const searchObj = {
                address,
                headerText,
                start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
                end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
            }
            ComplaintNotApproveMainController({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setComplaintObj(result);
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page404");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                });
        }
    }
    //-----------------Set Show Modal
    let complatintModal = null;
    if (showModal) {
        complatintModal = <ComplaintNotApproveModal
            hci_id={selectedObj.hci_id}
            hci_code={selectedObj.hci_code}
            showModal={showModal}
            setShowModal={setShowModal}
            setRefeshForm={setRefeshForm}
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
        if(getMonth>1){
            swal("Warning!", "เลือกช่วงเวลาห้ามมากกว่า 1 เดือน", "warning");
            return false;
        }
        return true;
    }
    //--------------------------
    return (
        <CCard>
            {complatintModal}
            <CCardHeader className="form-head-complaint">ร้องเรียนที่ยังไม่ได้ตรวจสอบ</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Complaint Not Approve Table
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
                                    'รับเรื่อง':
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
                                                        name="cil-bookmark"
                                                        color="danger" />
                                                    <span
                                                        hci_id={item.hci_id}
                                                        hci_code={item.hci_code}
                                                        className="btn-icon">จัดการคำร้อง</span></CButton>
                                            </td>
                                        ), 'ที่อยู่': (item) => (
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

export default ComplaintNotApproveMain;