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
import swal from 'sweetalert';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import store, { disAuthenticationLogin } from '../../../../store'
import { cartypeFields } from '../data/cartype-category-data'
import {getCartypeAll} from './Cartype-category-main-controller'

function CartypeCategoryInfoItemsList(props) {
    const {
        setSelectedCartypeObj,
        setShowLoading,
        setShowCartypeList,
        setShowCategoryList
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)

    //--------------State
    const [cartypeObj,setCartypeObj] = useState([]);
  
    const [refeshForm, setRefeshForm] = useState(false);
    //---------------Form load
    useEffect(() => {
        setShowLoading(true);
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

    function onClickSelectCartype(event){
        const cartype_id = event.target.getAttribute("cartype_id")
        const cartype_code = event.target.getAttribute("cartype_code")
        setSelectedCartypeObj({ cartype_id, cartype_code })
        setShowCartypeList(false);
        setShowCategoryList(true);
    }
    //--------------------------
    return (
        <div>
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
                                fields={cartypeFields}
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
                                                    onClick={onClickSelectCartype}
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
                                                        className="btn-icon">เลือก</span></CButton>
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
        </div>
    )
}

export default CartypeCategoryInfoItemsList;