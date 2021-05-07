import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Common-fee-management-main.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import CommonFeeManagementMainController, { getHomeNotDisableInfo } from './Common-fee-management-main-controller'
import InputEnable from '../../../component/input/InputEnable'
import CommonFeeManagementAdd from '../add/Common-fee-management-add'
import CommonFeeManagementEdit from '../edit/Common-fee-management-edit'
import { getPaymentEventArray } from '../../../../../utils/getPatmentEvent'
import { fields } from '../data/common-fee-main-data'

function CommonFeeManagementMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //------------------State
    const [commonFeeObj, setCommonFeeObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectCommon, setSelectCommon] = useState({
        scfi_id: "", scfi_code: ""
    })
    const [showLoading, setShowLoading] = useState(false);
    const [addressSearch, setAddressSearch] = useState('');
    const [addressArray, setAddressArray] = useState([]);
    const [paymentEventArray, setPaymentEventArray] = useState([]);
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
            getHomeAddress();
            getPaymentEvent();
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm(reset) {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = { home_address: reset ? null : addressSearch}
        CommonFeeManagementMainController({ authStore, searchObj })
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
        refeshForm(true);
    }
    //----------------Get home
    function getHomeAddress() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            getHomeNotDisableInfo({ authStore })
                .then((res) => {
                    if (res.result) {
                        const result = res.result.map((item) => { return { id: item.home_id, value: item.home_address } });
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
        setShowEditModal(true)
    }
    let modalEditCommon = null;
    if (showEditModal) {
        modalEditCommon = <CommonFeeManagementEdit
            selectCommon={selectCommon}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
            addressArray={addressArray}
            paymentEventArray={paymentEventArray}
        />
    }
    //--------------Show add form
    let modalShowValue = null;
    if (showAddModal) {
        modalShowValue = <CommonFeeManagementAdd
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
            addressArray={addressArray}
            paymentEventArray={paymentEventArray}
        />
    }
    //------------------Show Edit form

    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            {modalShowValue}
            {modalEditCommon}
            <CCardHeader className="form-commonfee-head">จัดการค่าใช้จ่ายของลูกบ้าน</CCardHeader>
            <div className="btn-addcommonfee">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowAddModal(true)}
                ><span>สร้างรายการเรียกเก็บค่าใช้จ่ายของลูกบ้าน</span></CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Villager cost Table
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
                                    , 'ช่วงเวลาที่เรียกเก็บ': (item) => (
                                        <td>
                                            <span>{item.date_from} ถึง {item.date_to}</span>
                                        </td>
                                    )
                                    , 'รายการค่าใช้จ่าย': (item) => (
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
                                    , 'แก้ไข':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    scfi_id={item.scfi_id}
                                                    scfi_code={item.scfi_code}
                                                    onClick={onViewClick}
                                                    className="btn-class btn-edit"
                                                    color="primary">
                                                    <CIcon
                                                        scfi_id={item.scfi_id}
                                                        scfi_code={item.scfi_code}
                                                        name="cil-pencil"
                                                        color="info" />
                                                    <span
                                                        scfi_id={item.scfi_id}
                                                        scfi_code={item.scfi_code}
                                                        className="btn-icon">แก้ไข</span></CButton>
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

export default CommonFeeManagementMain;