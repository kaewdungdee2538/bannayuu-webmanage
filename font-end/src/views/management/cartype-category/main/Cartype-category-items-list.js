import './Cartype-category-main.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
} from '@coreui/react'
import swal from 'sweetalert';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import store, { disAuthenticationLogin, unSelectCartype } from '../../../../store'
import CartypeCategoryAddModal from '../add/Cartype-category-add-modal'
import CartypeCategoryEditModal from '../edit/Cartype-category-edit'
import { categoryFields } from '../data/cartype-category-data'
import { getCartypeCategoryAllById } from './Cartype-category-main-controller'

function CartypeCategoryInfoItemsList(props) {
    const {
        setShowLoading,
        setShowCartypeList,
        setShowCategoryList,
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cartype_id = authStore.cartype_id;
    //--------------State
    const [refeshFormCartypeCategory, setRefeshFormCartypeCategory] = useState(false);
    const [cartypeCategoryObj, setCartypeCategoryObj] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectCategory,setSelectCategory] = useState({
        cartype_category_id:"",cartype_category_code:""
    })
    //---------------Form load
    useEffect(() => {
        setShowLoading(true);
        refeshFormFunc();
    }, [])

    //-----------------Refesh Form
    if (refeshFormCartypeCategory) {
        refeshFormFunc(true);
        setRefeshFormCartypeCategory(false);
    }
    function refeshFormFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            const searchObj = {
                cartype_id
            }
            getCartypeCategoryAllById({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        if (result.length > 0)
                            setCartypeCategoryObj(result);
                        else setCartypeCategoryObj([]);
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

    function onClickSelectCartype(event) {
        const cartype_category_id = event.target.getAttribute("cartype_category_id")
        const cartype_category_code = event.target.getAttribute("cartype_category_code")
        setSelectCategory({cartype_category_id,cartype_category_code});
        setShowEditModal(true);
    }
    //--------------------------On add cartype category click
    function onAddCartypeCategoryClick() {
        setShowAddModal(true);
    }
    //--------------------------ฺOn back to form before
    function onBackClick() {
        setShowCartypeList(true);
        setShowCategoryList(false);
        store.dispatch(unSelectCartype())
    }
    //-----------------Set Show edit Modal
    let cartypeEditModal = null;
    if (showEditModal) {
        cartypeEditModal = <CartypeCategoryEditModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setRefeshFormCartypeCategory={setRefeshFormCartypeCategory}
            selectCategory={selectCategory}
            setShowLoading={setShowLoading}
        />
    } else cartypeEditModal = null;

    //------------------set show add modal
    let cartypeAddModal = null;
    if (showAddModal) {
        cartypeAddModal = <CartypeCategoryAddModal
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            setRefeshFormCartypeCategory={setRefeshFormCartypeCategory}
            setShowLoading={setShowLoading}
        />
    }
    //--------------------------
    return (
        <CCol xs="12" lg="12">
            {cartypeEditModal}
            {cartypeAddModal}
            <div className="btn-add">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => onAddCartypeCategoryClick(true)}
                ><span>สร้างหมวดหมู่รถ</span></CButton>
            </div>
            <br></br>
            <CCol xs="12" lg="12">
                <CCard>
                    <CCardHeader>
                        Cartype Category Table
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            // onRowClick={onEditRowClick}
                            className="tb-modal-td"
                            items={cartypeCategoryObj}
                            fields={categoryFields}
                            striped
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                                'แก้ไข':
                                    (item) => (
                                        <td>
                                            <CButton
                                                cartype_category_id={item.cartype_category_id}
                                                cartype_category_code={item.cartype_category_code}
                                                onClick={onClickSelectCartype}
                                                className="btn-class btn-edit"
                                                color="primary">
                                                <CIcon
                                                    cartype_category_id={item.cartype_category_id}
                                                    cartype_category_code={item.cartype_category_code}
                                                    name="cil-pencil"
                                                    color="danger" />
                                                <span
                                                    cartype_category_id={item.cartype_category_id}
                                                    cartype_category_code={item.cartype_category_code}
                                                    className="btn-icon">แก้ไข</span></CButton>
                                        </td>
                                    ), 'หมวดหมู่รถ(ไทย)': (item) => (
                                        <td>
                                            <span>
                                                {item.cartype_category_name_th}
                                            </span>
                                        </td>
                                    ), 'หมวดหมู่รถ(Eng)': (item) => (
                                        <td>
                                            <span> {item.cartype_category_name_en}</span>
                                        </td>
                                    )
                                , 'ชื่อย่อ': (item) => (
                                    <td>
                                        <span> {item.cartype_category_name_contraction}</span>
                                    </td>
                                )
                            }
                            }
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CButton
                onClick={onBackClick}
                className="btn-class btn-back"
                color="danger">
                <span
                    className="btn-icon">ย้อนกลับ</span>
            </CButton>
        </CCol>
    )
}

export default CartypeCategoryInfoItemsList;