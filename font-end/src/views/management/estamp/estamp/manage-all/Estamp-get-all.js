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
import './Estamp-get-all.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import InlineDatePickerDemo from '../../../component/datetime/DatetimePickerInput'
import EstampGetAllController from './Estamp-get-all-controller'
import InputEnable from '../../../component/input/InputEnable'
import EstampModal from '../modal/Estamp-modal'
import store,{disAuthenticationLogin} from '../../../../../store'

const fields = ['ประทับตรา','บ้านเลขที่', 'ทะเบียนรถ', 'ชื่อ', 'เวลาเข้า', 'estamp']
const getBadge = status => {
    switch (status) {
        case 'YES': return 'success'
        case 'NOT': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
const getTextStatus = status => {
    switch (status) {
        case 'Y': return 'YES'
        case 'N': return 'NOT'
        default: return '-'
    }
}
function EstampGetAll(prop) {
    const { homeInfoObj, setShowVisitor, setShowLoading } = prop;
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [estampObj, setEstampObj] = useState(null);
    const [refesh, setRefesh] = useState(false);
    const [showEstampInfo, setShowEstampInfo] = useState({
        selected: false
        , visitor_record_id: ""
        , visitor_record_code: ""
        , home_id: !homeInfoObj ? "" : homeInfoObj.home_id
    });
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [license_plate, setLicense_plate] = useState("");
    const [f_name, setF_Name] = useState("");
    const [l_name, setL_Name] = useState("");

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
    if (refesh){
        refeshForm();
    }
        

    function refeshForm() {
        document.body.style.cursor = "wait";
        const selectedObj = {
            start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
            end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
            , license_plate, f_name, l_name
            , home_id: !homeInfoObj ? 0 : homeInfoObj.home_id
        }
        let isNotAuth;
        EstampGetAllController({ authStore, selectedObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setEstampObj(res.result);
                    else {
                        setEstampObj([]);
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error;
                }else swal("Warning!", res.error, "warning");
            })
            .catch((err) => {
                console.log(err);
                history.push("/page500");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                setRefesh(false);
                setShowLoading(false);
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }
    //----------------Search
    function onSearchClick(event) {
        setShowLoading(true);
        refeshForm();
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
    //-----------------Show Estamp Info
    let estmapInfo = null;
    if (showEstampInfo) {
        estmapInfo = <EstampModal
            showEstampInfo={showEstampInfo}
            setShowEstampInfo={setShowEstampInfo}
            setRefesh={setRefesh}
            setShowLoading={setShowLoading}
        />
    }

    function onViewClick(event) {
        const visitor_record_code = event.target.getAttribute("visitor_record_code")
        const visitor_record_id = event.target.getAttribute("visitor_record_id")
        setShowEstampInfo({
            selected: true
            , visitor_record_id
            , visitor_record_code
        })
    }
    //------------------Header
    let headerElem = null;
    //-----------------button back
    let btnBack = null;
    if (homeInfoObj) {
        btnBack = <CButton
            className="btn-modal-footer"
            color="danger"
            onClick={() => setShowVisitor(false)}>
            <CIcon
                name="cil-chevron-left"
                color="danger" />
            <span
                className="btn-icon">ย้อนกลับ</span></CButton>
        headerElem = <CCardHeader>
            บ้านเลขที่ {homeInfoObj.home_address}
                </CCardHeader>
    } else {
        btnBack = null;
        headerElem = null;
    }

    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            {headerElem}
            <CCardBody>
                <div className="">
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InlineDatePickerDemo
                                title="จาก"
                                text={dateTimeStart}
                                setText={handdingDateStart}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InlineDatePickerDemo
                                title="ถึง"
                                text={dateTimeEnd}
                                setText={handdingDateEnd}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputEnable
                                title="ชื่อ"
                                placeholder="Enter first name"
                                text={f_name}
                                setText={setF_Name}
                                maxLenght="150"
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputEnable
                                title="นามสกุล"
                                placeholder="Enter last name"
                                text={l_name}
                                setText={setL_Name}
                                maxLenght="150"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6"><InputEnable
                            title="ทะเบียนรถ"
                            placeholder="Enter license plate"
                            text={license_plate}
                            setText={setLicense_plate}
                            maxLenght="20"
                        /></CCol>
                    </CRow>
                </div>
                <div className="head">
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
                </div>

            </CCardBody>
            <CCard>
                <CCardHeader>
                    Visitor Table
                    </CCardHeader>
                <CCardBody>
                    <CDataTable
                        className="tb-modal-td"
                        items={estampObj}
                        fields={fields}
                        striped
                        itemsPerPage={5}
                        pagination
                        scopedSlots={{
                            'ชื่อ': (item) => (
                                <td>
                                    <span>{item.first_name_th} {item.last_name_th}</span>
                                </td>
                            )
                            , 'บ้านเลขที่': (item) => (
                                <td>
                                    <span>{item.home_address}</span>
                                </td>
                            )
                            , 'ทะเบียนรถ': (item) => (
                                <td>
                                    <span>{item.license_plate}</span>
                                </td>
                            )
                            , 'เวลาเข้า': (item) => (
                                <td>
                                    <span>{item.parking_in_datetime}</span>
                                </td>
                            )
                            , estamp:
                                (item) => (
                                    <td>
                                        <CBadge color={getBadge(getTextStatus(item.estamp_flag))}>
                                            {getTextStatus(item.estamp_flag)}
                                        </CBadge>
                                    </td>
                                )
                            , 'ประทับตรา':
                                (item) => (
                                    <td>
                                        <CButton
                                            visitor_record_id={item.visitor_record_id}
                                            visitor_record_code={item.visitor_record_code}
                                            onClick={onViewClick}
                                            className="btn-class btn-edit"
                                            color="primary">
                                            <CIcon
                                                visitor_record_id={item.visitor_record_id}
                                                visitor_record_code={item.visitor_record_code}
                                                name="cil-star"
                                                color="info" />
                                            <span
                                                visitor_record_id={item.visitor_record_id}
                                                visitor_record_code={item.visitor_record_code}
                                                className="btn-icon">ประทับตรา</span></CButton>
                                    </td>
                                )
                        }
                        }
                    />
                </CCardBody>
            </CCard>
            {estmapInfo}
            {btnBack}
        </CCol>
    )
}

export default EstampGetAll;