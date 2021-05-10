import './Cartype-main.css'
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
import swal from 'sweetalert';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'
import { fields } from '../data/cartype-data'
import { getCartypeAll } from './Cartype-main-controller'
import CartypeAddModal from '../add/Cartype-add-modal'
import CartypeEditModal from '../edit/Cartype-edit-modal'

function CartypeMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    //--------------State
    const [cartypeObj, setCartypeObj] = useState(null)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        cartype_id: "", cartype_code: ""
    });
    const [refeshForm, setRefeshForm] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    //---------------Form load
    useEffect(() => {
        // setShowLoading(true);
        refeshFormFunc();
    }, [])

    //-----------------Refesh Form
    if (refeshForm) {
        refeshFormFunc(true);
        setRefeshForm(false);
    }
    function refeshFormFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            getCartypeAll({ authStore })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        if (result.length > 0)
                        setCartypeObj(result);
                        else setCartypeObj([]);
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
                    setShowLoading(false);
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //-----------------Set Show Modal
    let cartypeEditModal = null;
    if (showEditModal) {
        cartypeEditModal = <CartypeEditModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setRefeshForm={setRefeshForm}
            selectedObj={selectedObj}
            setShowLoading={setShowLoading}
        />
    } else cartypeEditModal = null;
    //------------------on click show modal
    function onClickShowModal(event) {
        const cartype_id = event.target.getAttribute("cartype_id")
        const cartype_code = event.target.getAttribute("cartype_code")
        setSelectedObj({ cartype_id, cartype_code })
        setShowEditModal(true);
    }

    //------------------set show add modal
    let cartypeAddModal = null;
    if (showAddModal) {
        cartypeAddModal = <CartypeAddModal
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    }
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            {cartypeEditModal}
            {cartypeAddModal}
            <CCardHeader className="form-head-cartype">ประเภทรถ</CCardHeader>
            <div className="btn-add">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowAddModal(true)}
                ><span>สร้างประเภทรถ</span></CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Cartype Table
                    </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={cartypeObj}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'แก้ไข':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    cartype_id={item.cartype_id}
                                                    cartype_code={item.cartype_code}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-edit"
                                                    color="primary">
                                                    <CIcon
                                                        cartype_id={item.cartype_id}
                                                        cartype_code={item.cartype_code}
                                                        name="cil-pencil"
                                                        color="danger" />
                                                    <span
                                                        cartype_id={item.cartype_id}
                                                        cartype_code={item.cartype_code}
                                                        className="btn-icon">แก้ไข</span></CButton>
                                            </td>
                                        ), 'ประเภทรถ(ไทย)': (item) => (
                                            <td>
                                                <span>
                                                    {item.cartype_name_th}
                                                </span>
                                            </td>
                                        ), 'ประเภทรถ(Eng)': (item) => (
                                            <td>
                                                <span> {item.cartype_name_en}</span>
                                            </td>
                                        )
                                    , 'ชื่อย่อ': (item) => (
                                        <td>
                                            <span> {item.cartype_name_contraction}</span>
                                        </td>
                                    )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>
        </CCard>
    )
}

export default CartypeMain;