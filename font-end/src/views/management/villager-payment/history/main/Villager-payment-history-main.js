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
import './Villager-payment-history-main.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import * as moment from 'moment'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import InputEnable from '../../../component/input/InputEnable'
import { fields, getBadge } from '../data/villager-payment-history-data'
import DatePickerInput from '../../../component/datetime/DatePickerInput'
import ComboBoxSearchItem from '../../../component/combobox/ComboBoxSearchItem'
import { getPaymentEventArray } from '../../../../../utils/getPatmentEvent'

import { getVillagerPaymentHistory } from './Villager-payment-history-main-controller'
import VillagerPaymentHistoryModal from '../modal/Villager-payment-history-modal'
const paymentEventText = {
    id: 0, value: 'เลือกการจ่ายเงิน'
}
function VillagerPaymentHistoryMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(15, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD");
    const dateEnd = moment().add(15, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD")
    //------------------State
    const [commonFeeObj, setCommonFeeObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectVillagerPayment, setSelectVillagerPayment] = useState({
        tpcfi_id: "", tpcfi_code: ""
    })
    const [showLoading, setShowLoading] = useState(false);
    const [addressSearch, setAddressSearch] = useState('');
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [paymentEventArray, setPaymentEventArray] = useState([]);
    const [paymentEvent, setPaymentEvent] = useState({ value: "", id: 0 })
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            getPaymentEvent();
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = {
            home_address: addressSearch,
            payment_event_id: paymentEvent.id == 0 ? null : paymentEvent.id,
            start_date: dateTimeStart,
            end_date: dateTimeEnd,
        }
        getVillagerPaymentHistory({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setCommonFeeObj(res.result);
                    else setCommonFeeObj([]);
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

    //----------------Search
    function onSearchClick(event) {
        refeshForm();
    }
    //---------------Show edit form
    function onViewClick(event) {
        const tpcfi_id = event.target.getAttribute("tpcfi_id");
        const tpcfi_code = event.target.getAttribute("tpcfi_code");
        setSelectVillagerPayment({
            tpcfi_id, tpcfi_code
        })
        setShowModal(true)
    }
    //-----------------Set Show Modal
    let historyShowModal = null;
    if (showModal) {
        historyShowModal = <VillagerPaymentHistoryModal
            showModal={showModal}
            setShowModal={setShowModal}
            selectVillagerPayment={selectVillagerPayment}
            setShowLoading={setShowLoading}
        />
    } else historyShowModal = null;

    //-----------------Date Handing
    function handdingDateStart(event) {
        if (moment(event) > moment(dateTimeEnd)) {
            const newMoment = moment(event).add(1, 'days').format("YYYY-MM-DD")
            setDateTimeStart(event)
            setDateTimeEnd(newMoment)
        }
        else
            setDateTimeStart(event)
    }
    function handdingDateEnd(event) {
        if (moment(event) < moment(dateTimeStart)) {
            const newMoment = moment(event).subtract(1, 'days').format("YYYY-MM-DD")
            setDateTimeStart(newMoment)
            setDateTimeEnd(event);
        }
        else
            setDateTimeEnd(event)
    }

    //-----------------------Show Payment event
    let comboBoxPaymentArrayElem = null;
    //----------------Get Event Patment Array
    function getPaymentEvent() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            getPaymentEventArray({ authStore })
                .then((res) => {
                    if (res.result) {
                        const result = res.result.map((item) => { return { id: item.payment_event_id, value: item.payment_event_name } });
                        result.unshift({
                            id: 0,
                            value: "เลือกทั้งหมด"
                        })
                        setPaymentEventArray(result);
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
   
    if (paymentEventArray.length > 0) {
        comboBoxPaymentArrayElem = <ComboBoxSearchItem
            title="รายการค่าใช้จ่าย"
            text={paymentEventText}
            placeholder="Enter payment event"
            itemsArray={paymentEventArray}
            setText={setPaymentEvent}
        />
    }
    
    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            {historyShowModal}
            <CCardHeader className="form-villager-payment-history-head">ประวัติการชำระเงินของลูกบ้าน</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Villager payment history Table
                    </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <InputEnable
                                        title="ที่อยู่"
                                        placeholder="Enter home number"
                                        maxLength="30"
                                        text={addressSearch}
                                        setText={setAddressSearch}
                                    />
                                </CCol>
                                <CCol xs="12" sm="6" md="6">
                                    {comboBoxPaymentArrayElem}
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <DatePickerInput
                                        title="จาก"
                                        text={dateTimeStart}
                                        setText={handdingDateStart}
                                    />
                                </CCol>
                                <CCol xs="12" sm="6" md="6">
                                    <DatePickerInput
                                        title="ถึง"
                                        text={dateTimeEnd}
                                        setText={handdingDateEnd}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12">
                                    <div className="head">
                                        <CButton
                                            className="btn-class btn-head"
                                            color="info"
                                            onClick={onSearchClick}
                                        ><span className="span-head">ค้นหา</span>
                                        </CButton>
                                    </div>
                                </CCol>
                            </CRow>
                            <br></br>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={commonFeeObj}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'บ้านเลขที่': (item) => (
                                        <td>
                                            <span>{item.home_address}</span>
                                        </td>
                                    )
                                    , 'วันที่ชำระเงิน': (item) => (
                                        <td>
                                            <span>{item.create_date}</span>
                                        </td>
                                    )
                                    , 'รายการค่าใช้จ่าย':
                                        (item) => (
                                            <td>
                                                <span>{item.payment_event_name}</span>
                                            </td>
                                        )
                                    , 'จำนวนเงิน':
                                        (item) => (
                                            <td>
                                                <span>{item.payment_amount}</span>
                                            </td>
                                        )
                                    , 'แสดง':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    tpcfi_id={item.tpcfi_id}
                                                    tpcfi_code={item.tpcfi_code}
                                                    onClick={onViewClick}
                                                    className="btn-class btn-edit"
                                                    color="info">
                                                    <CIcon
                                                        tpcfi_id={item.tpcfi_id}
                                                        tpcfi_code={item.tpcfi_code}
                                                        name="cil-magnifying-glass"
                                                        color="info" />
                                                    <span
                                                        tpcfi_id={item.tpcfi_id}
                                                        tpcfi_code={item.tpcfi_code}
                                                        className="btn-icon">แสดง</span></CButton>
                                            </td>
                                        )
                                    , 'สถานะ':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.status)}>
                                                    {item.workflow_name}
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
        </CCard>)
}

export default VillagerPaymentHistoryMain;