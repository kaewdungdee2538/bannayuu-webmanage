import { useState, useEffect } from 'react'
import './Home-edit.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
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

const fields = ['edit', 'address', 'createdate', 'updatedate', 'delete']


const CoreUIHomeEdit = () => {
    const history = useHistory();
    const authStore = useSelector(store => store);
    const [homeInfo, setHomeInfo] = useState(null)
    const [refeshForm, setRefeshForm] = useState(false);
    useEffect(() => {
        if (!authStore.authorization) {
            history.push('/')
        }
        document.body.style.cursor = 'wait';
        getHomeInfo(authStore.access_token).then(res => {
            if (res.result) {
                if (res.result.length > 0)
                    setHomeInfo(res.result)
            }
            document.body.style.cursor = 'default';
        })

    }, []);
    const [selectedRow, setSelectedRow] = useState({ selected: false, home_id: '' });

    const [showCreateAdd, setShowCreateAdd] = useState(false);
    let selectedrow = null;
    if (!!selectedRow) {
        selectedrow = <HomeEditModal
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            authStore={authStore}
            setRefeshForm={setRefeshForm} />
    }

    //------------------Edit
    function onEditRowClick(event) {
        if (event.target.getAttribute("home_id"))
            setSelectedRow({ home_id: event.target.getAttribute("home_id"), selected: true })
    }
    //-------------------Refesh form
    if (!!refeshForm) {
        document.body.style.cursor = 'wait';
        getHomeInfo(authStore.access_token).then(res => {
            if (res.result) {
                if (res.result.length > 0)
                    setHomeInfo(res.result)
            }
            document.body.style.cursor = 'default';
        })
        //stop refesh form
        setRefeshForm(false);
    }
    let showCreateAddress = null;
    if (!!showCreateAdd) {
        showCreateAddress =
            <CoreUIHomeAdd
                showCreateAdd={showCreateAdd}
                setShowCreateAdd={setShowCreateAdd}
                setRefeshForm={setRefeshForm}
            />
    }
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
                        <CCardHeader className="home-form-head">
                            Home Table
            </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={homeInfo}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'address': (item) => (
                                        <td>
                                            <span>
                                                {item.home_address}
                                            </span>
                                        </td>
                                    )
                                    , 'createdate': (item) => (
                                        <td>
                                            <span>
                                                {!item.create_date ? '' : convertTZ(item.create_date)}
                                            </span>
                                        </td>
                                    )
                                    , 'updatedate': (item) => (
                                        <td>
                                            <span>
                                                {!item.update_date ? '' : convertTZ(item.update_date)}
                                            </span>
                                        </td>
                                    )
                                    , 'delete':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    home_id={item.home_id}
                                                    address={item.home_address}
                                                    onClick={deleteHomeModal}
                                                    className="btn-class btn-delete"
                                                    color="danger">
                                                    <CIcon
                                                        home_id={item.home_id}
                                                        address={item.home_address}
                                                        name="cil-ban" />
                                                    <span
                                                        home_id={item.home_id}
                                                        address={item.home_address}
                                                        className="btn-icon">ลบ</span></CButton>
                                            </td>
                                        )
                                    , 'edit':
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