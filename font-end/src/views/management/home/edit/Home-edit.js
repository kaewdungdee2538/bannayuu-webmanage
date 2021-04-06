import { useState, useEffect } from 'react'
import './Home-edit.css'
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
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import HomeEditModal from './Home-edit-modal'
import CoreUIHomeAdd from '../add/Home-add'
import getHomeInfo from './home-edit-modal-func'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { convertTZ } from '../../../../utils'
import { deleteHomeByID } from './home-edit-modal-func'
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'
import InputEnable from '../../component/input/InputEnable'
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'inactive': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
const fields = ['แก้ไข', 'บ้านเลขที่', 'วันที่สร้าง', 'วันที่แก้ไขล่าสุด', 'สถานะ']


const CoreUIHomeEdit = () => {
    const history = useHistory();
    const authStore = useSelector(store => store);
    const [homeInfo, setHomeInfo] = useState(null)
    const [refeshForm, setRefeshForm] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [address,setAddress] = useState('');
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //--------------------Form Load
    useEffect(() => {
        setShowLoading(true)
        refesh();
    }, []);
    const [selectedRow, setSelectedRow] = useState({ selected: false, home_id: '' });

    const [showCreateAdd, setShowCreateAdd] = useState(false);
    let selectedrow = null;
    if (!!selectedRow) {
        selectedrow = <HomeEditModal
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            authStore={authStore}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    }

    //------------------Edit
    function onEditRowClick(event) {
        if (event.target.getAttribute("home_id"))
            setSelectedRow({ home_id: event.target.getAttribute("home_id"), selected: true })
    }
    //-------------------Refesh form
    function refesh(){
        if (!authStore.authorization) {
            history.push('/')
        } else {
            let isNotAuth;
            document.body.style.cursor = 'wait';
            const searchObj = {home_address:address}
            getHomeInfo({authStore,searchObj}).then(res => {
                if (res.result) {
                    if (res.result.length > 0)
                        setHomeInfo(res.result)
                    else {
                        setHomeInfo(null);
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error;
                }
            }).catch(err => {
                console.log(err)
                history.push('/page404')
            }).finally(value => {
                document.body.style.cursor = 'default';
                setShowLoading(false);
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
                setRefeshForm(false);
            })
        }
    }
    if (refeshForm) {
        refesh();
    }
    let showCreateAddress = null;
    if (!!showCreateAdd) {
        showCreateAddress =
            <CoreUIHomeAdd
                showCreateAdd={showCreateAdd}
                setShowCreateAdd={setShowCreateAdd}
                setRefeshForm={setRefeshForm}
                setShowLoading={setShowLoading}
            />
    }
    //---------------------search
    function onSearchClick(event){
        refesh();
    }
    //---------------------Delete
    function deleteHomeModal(event) {
        const getAddress = event.target.getAttribute("address")
        const home_id = event.target.getAttribute("home_id")
        const homeObj = { home_id }
        if (getAddress)
            swal({
                title: "Are you sure?",
                text: `คุณต้องการจะลบบ้านเลขที่ ${getAddress} หรือไม่!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal({
                            title: "Delete!",
                            text: `ต้องลบบ้านเลขที่จริงหรือไม่!`,
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    document.body.style.cursor = 'wait';
                                    deleteHomeByID({ homeObj, authStore })
                                        .then(res => {
                                            if (res.error) swal({
                                                title: "Waring.",
                                                text: res.message,
                                                icon: "warning",
                                                button: "OK",
                                            })
                                            else {
                                                swal("ลบบ้านเรียนร้อย", {
                                                    icon: "success",
                                                });
                                                setRefeshForm(true);
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                            history.push('/page404')
                                        }).finally(value => {
                                            document.body.style.cursor = 'default';
                                        })
                                } else {

                                }
                            });
                    } else {

                    }
                });
    }

    return (
        <CCard>
            {loadingmodal}
            <CCardHeader className="home-form-head">ข้อมูลบ้าน</CCardHeader>
            <div className="btn-addhome">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowCreateAdd(true)}
                ><span>เพิ่มบ้าน</span></CButton>
            </div>

            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Home Table
            </CCardHeader>
                        <CCardBody>
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
                                <CCol xs="12" sm="12" md="12">
                                    <CButton
                                        className="btn-class btn-head btn-search"
                                        color="info"
                                        onClick={onSearchClick}
                                    >
                                        <CIcon
                                            name="cil-magnifying-glass"
                                            color="info" />
                                        <span className="span-head">ค้นหา</span>
                                    </CButton>
                                </CCol>
                            </CRow>
                            <br></br>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={homeInfo}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'บ้านเลขที่': (item) => (
                                        <td>
                                            <span>
                                                {item.home_address}
                                            </span>
                                        </td>
                                    )
                                    , 'วันที่สร้าง': (item) => (
                                        <td>
                                            <span>
                                                {!item.create_date ? '' : convertTZ(item.create_date)}
                                            </span>
                                        </td>
                                    )
                                    , 'วันที่แก้ไขล่าสุด': (item) => (
                                        <td>
                                            <span>
                                                {!item.update_date ? '' : convertTZ(item.update_date)}
                                            </span>
                                        </td>
                                    )
                                    , 'สถานะ': (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.status)}>
                                                {item.status}
                                            </CBadge>
                                        </td>
                                    )
                                    , 'แก้ไข':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    home_id={item.home_id}
                                                    onClick={onEditRowClick}
                                                    className="btn-class btn-edit"
                                                    color="primary">
                                                    <CIcon
                                                        home_id={item.home_id}
                                                        address={item.home_address}
                                                        name="cil-pencil"
                                                        color="danger" />
                                                    <span
                                                        home_id={item.home_id}
                                                        address={item.home_address}
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
            {selectedrow}
            {showCreateAddress}
        </CCard>
    )
}

export default CoreUIHomeEdit