import './Cartype-category-main.css'
import {
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LoadingModal from '../../component/loading/LoadingModal'
import CartypeCategoryCartypeInfo from './Cartype-category-cartype'
import CartypeCategoryInfoItemsList from './Cartype-category-items-list'

function CartypeCategoryMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------State
    const [showCartypeList, setShowCartypeList] = useState(true);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [selectedCartypeObj, setSelectedCartypeObj] = useState({
        cartype_id: "", cartype_code: ""
    });
    const [showLoading, setShowLoading] = useState(false);
    //-------------------Reload form
    const [refeshFormCartype, setRefeshFormCartype] = useState(false);
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    
    //----------------set cartype info list
    let cartypeInfoListItemsElem = null;
    if (showCartypeList) {
        cartypeInfoListItemsElem = <CartypeCategoryCartypeInfo
            setShowCartypeList={setShowCartypeList}
            setShowCategoryList={setShowCategoryList}
            setSelectedCartypeObj={setSelectedCartypeObj}
            setShowLoading={setShowLoading}
            setRefeshFormCartype={setRefeshFormCartype}
            refeshFormCartype={refeshFormCartype}
        />
    }
    //----------------Set show category info list
    let categoryInfoListItemsElem = null;
    if (showCategoryList) {
        categoryInfoListItemsElem = <CartypeCategoryInfoItemsList
            setShowCartypeList={setShowCartypeList}
            setShowCategoryList={setShowCategoryList}
            setShowLoading={setShowLoading}
            setSelectedCartypeObj={setSelectedCartypeObj}
            selectedCartypeObj={selectedCartypeObj}
        />
    }
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            <CCardHeader className="form-head-cartype">หมวดหมู่รถ</CCardHeader>
            <CCardBody>
                {cartypeInfoListItemsElem}
                {categoryInfoListItemsElem}
            </CCardBody>
        </CCard>
    )
}

export default CartypeCategoryMain;