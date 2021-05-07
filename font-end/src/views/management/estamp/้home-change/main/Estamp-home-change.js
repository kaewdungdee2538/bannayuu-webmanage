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
import './Estamp-home-change.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import InputEnable from '../../../component/input/InputEnable'
import DatetimePickerInput from '../../../component/datetime/DatetimePickerInput'
import { fields, getBadge, getTextStatus } from '../data/estamp-home-change-data'
import { VisitorGetNotEstampController } from './Estamp-home-change-controller'
import EstampHomeChangeModal from '../modal/Estamp-home-change-modal'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'

export default function EstampHomeChange() {

    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format("YYYY-MM-DDTHH:mm")
    //--------------State
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [refesh, setRefesh] = useState(false);
    const [showVisitorModal, setShowVisitorModal] = useState({
        selected: false
        , visitor_record_id: ""
        , visitor_record_code: ""
    })
    const [visitorObj, setVisitorObj] = useState([]);
    const [license_plate, setLicense_plate] = useState("");
    const [f_name, setF_Name] = useState("");
    const [l_name, setL_Name] = useState("");
    const [home_address, setHome_address] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            refeshForm();
        }
    }, []);
    //--------------Reset form
    if (refesh)
        refeshForm();

    function refeshForm() {
        document.body.style.cursor = "wait";
        setShowLoading(true)
        const selectedObj = {
            start_date: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString(),
            end_date: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
            , license_plate, f_name, l_name, home_address
        }
        let isNotAuth;
        VisitorGetNotEstampController({ authStore, selectedObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setVisitorObj(res.result);
                    else {
                        setVisitorObj([]);
                    }
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
                setRefesh(false);
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
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
    //----------------Search
    function onSearchClick(event) {
        refeshForm();
    }
    //-----------------Show Modal
    let visitorModal = null;
    if (showVisitorModal.selected) {
        visitorModal = <EstampHomeChangeModal
            showVisitorModal={showVisitorModal}
            setShowVisitorModal={setShowVisitorModal}
            setRefesh={setRefesh}
        />
    } else visitorModal = null;

    function onViewClick(event) {
        const visitor_record_code = event.target.getAttribute("visitor_record_code")
        const visitor_record_id = event.target.getAttribute("visitor_record_id")
        setShowVisitorModal({
            selected: true
            , visitor_record_id
            , visitor_record_code
        })
    }
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //--------------------------------
    return (
        <CCard>
            {loadingmodal}
            {visitorModal}
            <CCardHeader className="form-head-estamp-change-home">เปลี่ยนบ้านให้ผู้มาเยือน</CCardHeader>
            <CCol xs="12" lg="12">
                <CCardBody>
                    <div className="">
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
                            items={visitorObj}
                            fields={fields}
                            striped
                            itemsPerPage={5}
                            pagination
                            scopedSlots={{
                                'ชื่อ-สกุล': (item) => (
                                    <td>
                                        <span>{item.first_name_th} {item.last_name_th}</span>
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
                                                    name="cil-fullscreen-exit"
                                                    color="info" />
                                                <span
                                                    visitor_record_id={item.visitor_record_id}
                                                    visitor_record_code={item.visitor_record_code}
                                                    className="btn-icon">เปลี่ยนบ้าน</span></CButton>
                                        </td>
                                    )
                            }
                            }
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CCard>
    );
}