import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Annouce-main.css'
import CIcon from '@coreui/icons-react'
import AnnouceAddModal from '../add/Announce-add-modal'
import getAnnouceModal from './Announce-main-controller'
import AnnouceEditModal from '../edit/Announce-edit-modal'
import swal from 'sweetalert';
import cancelAnnouceModal from '../delete/announce-delete-controller'
import LoadingModal from '../../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../../store'

const fields = ['แก้ไข', 'ชื่อ-สกุล', 'เรื่อง', 'วันที่ประกาศ', 'สถานะ', 'ยกเลิกประกาศ']
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'posted': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}
function AnnouceMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [showAddAnnouce, setShowAddAnnouce] = useState(false);
    const [resfeshForm, setRefeshForm] = useState(false);
    const [announceObj, setAnnounceObj] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editObj, setEditObj] = useState({
        hni_id: ""
        , hni_code: ""
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
            setShowLoading(true)
            refeshForm();
        }
    }, []);
    //-------------Refesh form
    function refeshForm() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        getAnnouceModal({ authStore })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setAnnounceObj(res.result);
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
                setShowLoading(false);
                setRefeshForm(false);
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

    //-------------Add Annouce
    function onClickAddAnnouce(event) {
        setShowAddAnnouce(true);
    }
    let addAnnouceModal = null;
    if (showAddAnnouce) {
        addAnnouceModal = <AnnouceAddModal
            showAddAnnouce={showAddAnnouce}
            setShowAddAnnouce={setShowAddAnnouce}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    }
    //-------------Edit Announce
    function onEditClick(event) {
        const hni_id = event.target.getAttribute("hni_id")
        const hni_code = event.target.getAttribute("hni_code")
        setEditObj({
            hni_id
            , hni_code
        })
        setShowEdit(true);
    }
    let modalEdit = null;
    if (showEdit) {
        modalEdit = <AnnouceEditModal
            showEdit={showEdit}
            setShowEdit={setShowEdit}
            setRefeshForm={setRefeshForm}
            editObj={editObj}
            setShowLoading={setShowLoading}
        />
    }
    //--------------Cancel Announce
    function onCancelClick(event) {
        const hni_id = event.target.getAttribute("hni_id")
        const announceObj = {
            hni_id
        }
        if (hni_id) {
            swal({
                title: "Are you sure?",
                text: `คุณต้องการยกเลิกประกาศ หรือไม่!`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal({
                            title: "Delete!",
                            text: "ต้องการยกเลิกประกาศจริง หรือไม่!",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    let isNotAuth;
                                    setShowLoading(true)
                                    document.body.style.cursor = 'wait';
                                    cancelAnnouceModal({ authStore, announceObj })
                                        .then(res => {
                                            if (res.error) {
                                                if (res.statusCode === 401) {
                                                    isNotAuth = res.error
                                                } else swal({
                                                    title: "Waring.",
                                                    text: res.message,
                                                    icon: "warning",
                                                    button: "OK",
                                                })
                                            } else {
                                                swal("ลบลูกบ้านเรียนร้อย", {
                                                    icon: "success",
                                                });
                                                setRefeshForm(true);
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                            history.push('/page404')
                                        }).finally(value => {
                                            document.body.style.cursor = 'default';
                                            if (isNotAuth) {
                                                swal("Warning!", isNotAuth, "warning");
                                                history.push("/");
                                                //clear state global at store 
                                                store.dispatch(disAuthenticationLogin());
                                            }
                                        })
                                } else {

                                }
                            });
                    } else {
                    }
                });
        }
    }
    return (<CCard>
        <CCardHeader className="form-head">จัดการประกาศลูกบ้าน</CCardHeader>
        <div className="btn-add">
            <CButton
                className="btn-head"
                color="success"
                onClick={onClickAddAnnouce}
            ><span className="span-head">เพิ่มประกาศ</span></CButton>
        </div>

        <CCardBody>
            <CCol xs="12" lg="12">
                <CCard>
                    <CCardHeader>
                        Annouce Table
                    </CCardHeader>
                    <CCardBody>
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

                                , 'ยกเลิกประกาศ':
                                    (item) => (
                                        <td>
                                            <CButton
                                                hni_id={item.hni_id}
                                                hni_code={item.hni_code}
                                                onClick={onCancelClick}
                                                className="btn-class btn-delete"
                                                color="danger">
                                                <CIcon
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
                                                    name="cil-ban" />
                                                <span
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
                                                    className="btn-icon">ยกเลิก</span></CButton>
                                        </td>
                                    )
                                , 'แก้ไข':
                                    (item) => (
                                        <td>
                                            <CButton
                                                hni_id={item.hni_id}
                                                hni_code={item.hni_code}
                                                onClick={onEditClick}
                                                className="btn-class btn-edit"
                                                color="primary">
                                                <CIcon
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
                                                    name="cil-pencil"
                                                    color="danger" />
                                                <span
                                                    hni_id={item.hni_id}
                                                    hni_code={item.hni_code}
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
        {loadingmodal}
        {addAnnouceModal}
        {modalEdit}
    </CCard>)
}

export default AnnouceMain;