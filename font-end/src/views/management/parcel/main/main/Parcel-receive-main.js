import './Parcel-receive-main.css'
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
import { ParcelReceiveMainController,getHomeNotDisableInfo } from './Parcel-receive-main-controller'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import InputEnable from '../../../component/input/InputEnable'
import ParcelReceiveAdd from '../add/Parcel-receive-add'
import ParcelSendModal from '../send/Parcel-send-modal'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import {getBadge,getStatus,fields} from '../data/parcel-main-data'

function ParcelReceiveMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [parcelObj, setParcelObj] = useState(null)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        hci_id: "", hci_code: ""
    });
    const [refeshForm, setRefeshForm] = useState(false);
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [address, setAddress] = useState('');
    const [headerText, setHeaderText] = useState('')
    const [showLoading, setShowLoading] = useState(false);
    const [addressArray,setAddressArray] = useState([]);
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
        setShowLoading(true);
        getHomeAddress();
        refeshFormFunc();
    }, [])
    //----------------get Home Address
    function getHomeAddress(){
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            getHomeNotDisableInfo({ authStore })
                .then((res) => {
                    if (res.result) {
                        const result = res.result.map((item)=>{return {id:item.home_id,value:item.home_address}});
                        setAddressArray(result);
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
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    //-----------------Refesh Form
    if (refeshForm) {
        refeshFormFunc(true);
        setRefeshForm(false);
    }
    function refeshFormFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            const searchObj = {
                address : reset ? null : address,
                headerText : reset ? null : headerText,
                start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
                end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
            }
            ParcelReceiveMainController({ authStore, searchObj })
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
    let parcelEditModal = null;
    if (showEditModal) {
        parcelEditModal = <ParcelSendModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setRefeshForm={setRefeshForm}
            selectedObj={selectedObj}
            setShowLoading={setShowLoading}
        />
    } else parcelEditModal = null;
    //------------------on click show modal
    function onClickShowModal(event) {
        const tpi_id = event.target.getAttribute("tpi_id")
        const tpi_code = event.target.getAttribute("tpi_code")
        setSelectedObj({ tpi_id, tpi_code })
        setShowEditModal(true);
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
    //------------------set show add modal
    let parcelAddModal = null;
    if (showAddModal) {
        parcelAddModal = <ParcelReceiveAdd
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
            addressArray={addressArray}
        />
    }
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            {parcelEditModal}
            {parcelAddModal}
            <CCardHeader className="form-head-parcel">รับ-ส่งพัสดุให้ลูกบ้าน</CCardHeader>
            <div className="btn-addparcel">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowAddModal(true)}
                ><span>สร้างรายการรับพัสดุ</span></CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Send Parcel Table
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
                                    'ส่งพัสดุ':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    tpi_id={item.tpi_id}
                                                    tpi_code={item.tpi_code}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-edit"
                                                    color="primary">
                                                    <CIcon
                                                        tpi_id={item.tpi_id}
                                                        tpi_code={item.tpi_code}
                                                        name="cil-check"
                                                        color="danger" />
                                                    <span
                                                        tpi_id={item.tpi_id}
                                                        tpi_code={item.tpi_code}
                                                        className="btn-icon">ส่งพัสดุ</span></CButton>
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
        </CCard>
    )
}

export default ParcelReceiveMain;