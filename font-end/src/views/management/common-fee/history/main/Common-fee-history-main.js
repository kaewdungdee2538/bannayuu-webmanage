import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
    CSwitch,
    CLabel,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Common-fee-history-main.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import * as moment from 'moment'
import { getCommonFeeHistory } from './Common-fee-history-main-controller'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import InputEnable from '../../../component/input/InputEnable'
import { fields, getBadge, getTextStatus } from '../data/common-fee-history-data'
import DatetimePickerInput from '../../../component/datetime/DatePickerInput'
import CommonFeeHistoryModal from '../modal/Common-fee-history-modal'
function CommonFeeManagementHistory() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().subtract(15, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD");
    const dateEnd = moment().add(15, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DD")
    //------------------State
    const [commonFeeObj, setCommonFeeObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectCommon, setSelectCommon] = useState({
        scfi_id: "", scfi_code: ""
    })
    const [showLoading, setShowLoading] = useState(false);
    const [addressSearch, setAddressSearch] = useState('');
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [isCheckBox, setIsCheckBox] = useState(true);
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
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = {
            home_address: addressSearch,
            start_date: dateTimeStart,
            end_date: dateTimeEnd,
            search_type: isCheckBox ? 'start_date' : 'end_date'
        }
        getCommonFeeHistory({ authStore, searchObj })
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
                history.push("/page404");
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
        const scfi_id = event.target.getAttribute("scfi_id");
        const scfi_code = event.target.getAttribute("scfi_code");
        setSelectCommon({
            scfi_id, scfi_code
        })
        setShowModal(true)
    }
    let modalShowCommon = null;
    if (showModal) {
        modalShowCommon = <CommonFeeHistoryModal
            selectCommon={selectCommon}
            showModal={showModal}
            setShowModal={setShowModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    }

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
    //------------------on change select box
    function onCheckBoxChange(event) {
        if (!event.target.checked)
            setIsCheckBox(false);
        else
            setIsCheckBox(true);
    }
    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            {modalShowCommon}
            <CCardHeader className="form-commonfee-head">ประวัติการเรียกเก็บค่าส่วนกลาง</CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Common fee Table
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
                            </CRow>
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
                                    <CLabel>ค้นหาจากวันเริ่มต้น</CLabel>
                                    <br></br>
                                    <CSwitch className={'mx-1'}
                                        color={'info'}
                                        labelOn={'\u2713'}
                                        labelOff={'\u2715'}
                                        checked={isCheckBox}
                                        onChange={onCheckBoxChange} />
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
                                    , 'จากวันที่': (item) => (
                                        <td>
                                            <span>{item.date_from}</span>
                                        </td>
                                    )
                                    , 'ถึงวันที่': (item) => (
                                        <td>
                                            <span>{item.date_to}</span>
                                        </td>
                                    )
                                    , 'ค่าส่วนกลาง':
                                        (item) => (
                                            <td>
                                                <span>{item.payment_amount}</span>
                                            </td>
                                        )
                                    , 'แสดง':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    scfi_id={item.scfi_id}
                                                    scfi_code={item.scfi_code}
                                                    onClick={onViewClick}
                                                    className="btn-class btn-edit"
                                                    color="info">
                                                    <CIcon
                                                        scfi_id={item.scfi_id}
                                                        scfi_code={item.scfi_code}
                                                        name="cil-magnifying-glass"
                                                        color="info" />
                                                    <span
                                                        scfi_id={item.scfi_id}
                                                        scfi_code={item.scfi_code}
                                                        className="btn-icon">แสดง</span></CButton>
                                            </td>
                                        )
                                    , 'สถานะ':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.status)}>
                                                    {getTextStatus(item.status)}
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

export default CommonFeeManagementHistory;