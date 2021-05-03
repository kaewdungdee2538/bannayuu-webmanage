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
import '../main/Parking-main.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'
import ComboBoxSearchItem from '../../component/combobox/ComboBoxSearchItem'
import { getParkingMasterAll } from './Parking-master-controller'
import { fields } from '../data/parking-data'
const cartypeText = {
    id: 0, value: 'เลือกการจ่ายเงิน'
}
function ParkingMaster(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //------------------Props
    const { setShowLoading
        , setShowMasterForm
        , setShowHeaderForm
        , setSelectParkingMaster
        , cartypesInfoArr
        , setShowMasterEditForm
    } = props;
    //------------------State
    const [parkingMasterObj, setParkingMasterObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);
    
    const [cartypeEvent, setCartypeEvent] = useState(cartypeText)
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
            cartype_id: cartypeEvent.id > 0 ? cartypeEvent.id : null,
        }
        getParkingMasterAll({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setParkingMasterObj(res.result);
                    else setParkingMasterObj([]);
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
        setShowLoading(true);
        refeshForm();
    }
    //---------------Show edit form
    function onViewClick(event) {
        const cpm_id = event.target.getAttribute("cpm_id");
        const cpm_code = event.target.getAttribute("cpm_code");
        setSelectParkingMaster({
            cpm_id, cpm_code
        })
        setShowMasterEditForm(true);
        setShowMasterForm(false);
    }

    //------------------Combobox cartype
    let comboBoxPaymentArrayElem = null;
    if (cartypesInfoArr.length > 0) {
        comboBoxPaymentArrayElem = <ComboBoxSearchItem
            title="รายการค่าใช้จ่าย"
            text={cartypeEvent}
            placeholder="Enter cartype"
            itemsArray={cartypesInfoArr}
            setText={setCartypeEvent}
        />
    }
    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            <CCard>
                <CCardHeader>
                    Parking Rate Table
                    </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            {comboBoxPaymentArrayElem}
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
                        items={parkingMasterObj}
                        fields={fields}
                        striped
                        itemsPerPage={10}
                        pagination
                        scopedSlots={{
                            'ประเภทรถ': (item) => (
                                <td>
                                    <span>{item.cartype_name_th}</span>
                                </td>
                            ), 'ชื่อ Master Rate': (item) => (
                                <td>
                                    <span>{item.cpm_name_th}</span>
                                </td>
                            ), 'ประเภทวัน': (item) => (
                                <td>
                                    <span>{item.day_type}</span>
                                </td>
                            ), 'เริ่ม': (item) => (
                                <td>
                                    <span>{item.cpm_start_date}</span>
                                </td>
                            ), 'ถึง': (item) => (
                                <td>
                                    <span>{item.cpm_stop_date}</span>
                                </td>
                            ), 'จัดการ':
                                (item) => (
                                    <td>
                                        <CButton
                                            cpm_id={item.cpm_id}
                                            cpm_code={item.cpm_code}
                                            onClick={onViewClick}
                                            className="btn-class btn-edit"
                                            color="primary">
                                            {/* <CIcon
                                                cpm_id={item.cpm_id}
                                                cpm_code={item.cpm_code}
                                                name="cil-magnifying-glass"
                                                color="info" /> */}
                                            <span
                                                cpm_id={item.cpm_id}
                                                cpm_code={item.cpm_code}
                                                className="btn-icon">เลือก</span></CButton>
                                    </td>
                                )
                        }
                        }
                    />
                </CCardBody>
            </CCard>
        </CCol>
    )
}

export default ParkingMaster;