import './Cartype-category-main.css'
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
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'
import CartypeCategoryCartypeInfo from './Cartype-category-cartype'
import CartypeCategoryInfoItemsList from './Cartype-category-items-list'

function CartypeCategoryMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    //--------------State
    const [showCartypeList, setShowCartypeList] = useState(true);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCartypeObj, setSelectedCartypeObj] = useState({
        cartype_id: "", cartype_code: ""
    });

    const [showLoading, setShowLoading] = useState(false);
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
        // cartypeEditModal = <CartypeEditModal
        //     showEditModal={showEditModal}
        //     setShowEditModal={setShowEditModal}
        //     setRefeshForm={setRefeshForm}
        //     selectedObj={selectedObj}
        //     setShowLoading={setShowLoading}
        // />
    } else cartypeEditModal = null;

    //------------------set show add modal
    let cartypeAddModal = null;
    if (showAddModal) {
        // cartypeAddModal = <CartypeAddModal
        //     showAddModal={showAddModal}
        //     setShowAddModal={setShowAddModal}
        //     setRefeshForm={setRefeshForm}
        //     setShowLoading={setShowLoading}
        // />
    }
    //----------------set cartype info list
    let cartypeInfoListItemsElem = null;
    if (showCartypeList) {
        cartypeInfoListItemsElem = <CartypeCategoryCartypeInfo
            setShowCartypeList={setShowCartypeList}
            setShowCategoryList={setShowCategoryList}
            setSelectedCartypeObj={setSelectedCartypeObj}
            setShowLoading={setShowLoading}
        />
    }
    //----------------Set show category info list
    let categoryInfoListItemsElem = null;
    if(showCategoryList){
        categoryInfoListItemsElem = <CartypeCategoryInfoItemsList
        setShowCartypeList={setShowCartypeList}
        setShowCategoryList={setShowCategoryList}
        setShowAddModal={setShowAddModal}
        setShowEditModal={setShowEditModal}
        setSelectedCartypeObj={setSelectedCartypeObj}
        setShowLoading={setShowLoading}
        />
    }
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            {cartypeEditModal}
            {cartypeAddModal}
            <CCardHeader className="form-head-cartype">หมวดหมู่รถ</CCardHeader>
            {cartypeInfoListItemsElem}
            {categoryInfoListItemsElem}
        </CCard>
    )
}

export default CartypeCategoryMain;