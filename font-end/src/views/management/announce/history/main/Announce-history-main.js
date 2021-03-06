import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CDataTable,
    CBadge
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Announce-history-main.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import DateMaterialUi from '../../../component/datetime/DateMaterialUi'
import HistorySelectObject from './itemForSearch'
import AnnounceHistoryMainController from './Announce-history-main-controller'
import AnnounceHistoryModal from '../modal/Announce-history-modal'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'
import * as moment from 'moment';

const fields = ['แสดง', 'ชื่อ-สกุล', 'เรื่อง', 'วันที่ประกาศ', 'สถานะ']
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'posted': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}

function AnnounceHistoryMain() {
    const _dateStart = moment().subtract(30, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const _dateEnd = moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    const history = useHistory();
    const authStore = useSelector(state => state)
    const [announceObj, setAnnounceObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);
    const [dateStart, setDateStart] = useState(_dateStart);
    const [dateEnd, setDateEnd] = useState(_dateEnd);
    const [showHistory, setShowHistory] = useState(false);
    const [selectHistory, setSelectHistory] = useState({
        hni_id: "", hni_code: ""
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
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm() {
        let isNotAuth;
        setShowLoading(true);
        document.body.style.cursor = "wait";
        const valuesObj = {
            start_date: moment(dateStart).format("YYYY-MM-DD HH:mm:ss")
            , stop_date: moment(dateEnd).format("YYYY-MM-DD HH:mm:ss")
        }
        AnnounceHistoryMainController({ authStore, valuesObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setAnnounceObj(res.result);
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
    //-----------------Date Handing
    function handdingDateStart(date) {
        if (moment(date) > moment(dateEnd)) {
            const newMoment = moment(date).add(1, 'days')
            setDateStart(date)
            setDateEnd(newMoment)
        }
        else
            setDateStart(date)
    }
    function handdingDateEnd(date) {
        if (moment(date) < moment(dateStart)) {
            const newMoment = moment(date).subtract(1, 'days')
            setDateStart(newMoment)
            setDateEnd(date);
        }
        else
            setDateEnd(date)
    }
    //----------------Search
    function onSearchClick(event) {
        refeshForm();
    }
    //---------------Show history
    function onViewClick(event) {
        const hni_id = event.target.getAttribute("hni_id");
        const hni_code = event.target.getAttribute("hni_code");
        setSelectHistory({
            hni_id, hni_code
        })
        setShowHistory(true)
    }
    let modalShowValue = null;
    if (showHistory) {
        modalShowValue = <AnnounceHistoryModal
            authStore={authStore}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            selectHistory={selectHistory}
            setShowLoading={setShowLoading}
        />
    }
    //---------------------------------------------
    return (<CCard>
        <CCardHeader className="form-head">ประวัติประกาศโครงการ</CCardHeader>

        <CCardBody>
            <CCol xs="12" lg="12">
                <CCard>
                    <CCardHeader>
                        Annouce Table
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol xs="12" sm="6" md="6">
                                <DateMaterialUi
                                    title="วันที่ค้นหาเริ่มต้น"
                                    selectedDate={dateStart}
                                    setSelectedDate={handdingDateStart}
                                />
                            </CCol>
                            <CCol xs="12" sm="6" md="6">
                                <DateMaterialUi
                                    title="วันที่ค้นหาสิ้นสุด"
                                    selectedDate={dateEnd}
                                    setSelectedDate={handdingDateEnd}
                                />
                            </CCol>
                        </CRow>
                        <br></br>
                        <div className="head">
                            <CButton
                                className="btn-class btn-head"
                                color="info"
                                onClick={onSearchClick}
                            ><span className="span-head">ค้นหา</span>
                            </CButton>
                        </div>
                        <CDataTable
                            // onRowClick={onEditRowClick}
                            className="tb-modal-td"
                            items={announceObj}
                            fields={fields}
                            striped
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                                'ชื่อ-สกุล': (item) => (
                                    <td>
                                        <span>{item.hni_name}</span>
                                    </td>
                                )
                                , 'เรื่อง': (item) => (
                                    <td>
                                        <span>{item.hni_header_text}</span>
                                    </td>
                                )
                                , 'วันที่ประกาศ': (item) => (
                                    <td>
                                        <span>{item.hni_start_datetime}</span>
                                    </td>
                                )
                                , 'สถานะ':
                                    (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.status)}>
                                                {item.status}
                                            </CBadge>
                                        </td>
                                    )
                                , 'แสดง':
                                    (item) => (
                                        <td>
                                            <CButton
                                                hni_id={item.hni_id}
                                                hni_code={item.hni_code}
                                                onClick={onViewClick}
                                                className="btn-class btn-view"
                                                color="info">
                                                <CIcon
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
                                                    name="cil-magnifying-glass"
                                                    color="info" />
                                                <span
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
                                                    className="btn-icon">เรียกดู</span></CButton>
                                        </td>
                                    )
                            }
                            }
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CCardBody>
        {loadingmodal}
        {modalShowValue}
    </CCard>)
}

export default AnnounceHistoryMain;