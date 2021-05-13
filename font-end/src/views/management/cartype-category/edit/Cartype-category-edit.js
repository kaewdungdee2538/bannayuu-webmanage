import { useState, useEffect } from 'react'
import './Cartype-category-edit.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import InputEnable from '../../component/input/InputEnable'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CRow,
    CCol,
} from '@coreui/react'
import {
    getCartypeCategoryByID,
    editCartypeCategory,
    disableCartypeCategory
} from './Cartype-category-edit-controller'
import store, { disAuthenticationLogin } from '../../../../store'
import TextArea from '../../component/textarea/TextArea'
import CIcon from '@coreui/icons-react'

function CartypeCategoryEditModal({
    setRefeshFormCartypeCategory,
    setShowLoading,
    selectCategory,
    showEditModal,
    setShowEditModal,
}) {
    const history = useHistory();
    const authStore = useSelector(state => state);
    const cartype_id = authStore.cartype_id;
    //-------------State
    const [cartypeCategotyInfo, setCartypeCategoryInfo] = useState({
        cartype_category_id: null,
        cartype_category_code: "",
        cartype_category_name_contraction: "",
        cartype_category_name_th: "",
        cartype_category_name_en: "",
        cartype_name_th: "",
        cartype_name_en: "",
        create_by: null,
        create_date: null,
        update_by: null,
        update_date: null,
        company_name: ""
    });
    const [cartypeCategoryNameTh, setCartypeCategoryNameTh] = useState("");
    const [cartypeCategoryNameEn, setCartypeCategoryeNameEn] = useState("");
    const [cartypeCategoryContractionName, setCartypeCategoryContractionName] = useState("");
    const [remark, setRemark] = useState("");
    //---------------Form load
    useEffect(() => {
        setShowLoading(true);
        getCategoryInfoById();
    }, [])
    //----------------Get Category By id
    function getCategoryInfoById() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            const valuesObj = {
                cartype_category_id: selectCategory.cartype_category_id
            }
            getCartypeCategoryByID({ authStore, valuesObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setCartypeCategoryInfo(result);
                        setCartypeCategoryNameTh(result.cartype_category_name_th)
                        setCartypeCategoryeNameEn(result.cartype_category_name_en)
                        setCartypeCategoryContractionName(result.cartype_category_name_contraction)
                        setRemark(result.remark)
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
    //--------------Close modal
    function closeModal() {
        setShowEditModal(false);
    }
    //--------------edit cartype
    function editCategory() {
        const middleware = editCartypeCategoryMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                cartype_category_id: selectCategory.cartype_category_id
                , name_th: cartypeCategoryNameTh
                , name_en: cartypeCategoryNameEn
                , name_contraction: cartypeCategoryContractionName
                , remark
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            editCartypeCategory({ authStore, valuesObj })
                .then(res => {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error
                        } else swal({
                            title: "Warning.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                    } else {
                        swal({
                            title: "Success.",
                            text: "แก้ไขหมวดหมู่รถเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setShowLoading(false)
                        setRefeshFormCartypeCategory(true)
                        closeModal();
                    }
                    document.body.style.cursor = 'default';
                }).catch((err) => {
                    console.log(err);
                    history.push("/page500");
                })
                .finally((value) => {
                    setShowLoading(false)
                    document.body.style.cursor = "default";
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }

    function editCartypeCategoryMiddleware() {
        if (!cartype_id) return 'ไม่พบรหัสยืนยันประเภทรถ กรุณาย้อนกลับไปเลือกประเภทรถใหม่อีกครั้ง'
        if (!cartypeCategoryNameTh) return 'กรุณากรอกชื่อภาษาไทย'
        else if (!cartypeCategoryNameEn) return 'กรุณากรอกชื่อภาษาอังกฤษ'
        else if (!cartypeCategoryContractionName) return 'กรุณากรอกชื่อย่อ'
        else if (!remark) return 'กรุณากรอกหมายเหตุ'
        return null;
    }

    //----------------------------On Disable
    function onDisableClick() {
        swal("หมายเหตุ:", {
            content: "input",
        })
            .then((value) => {
                if (!value)
                    swal({
                        title: "Warning.",
                        text: `กรุณากรอกหมายเหตุ`,
                        icon: "warning",
                        button: "OK",
                    });
                else swal({
                    title: "Are you sure?",
                    text: "ต้องการลบหมวดหมู่รถ หรือไม่!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        disableSaveClick(value);
                    }
                });
            });
    }
    function disableSaveClick(remarkInput) {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                cartype_category_id: selectCategory.cartype_category_id
                , remark: remarkInput
            }
        }
        let isNotAuth;
        disableCartypeCategory(values).then(res => {
            if (res.error) {
                if (res.statusCode === 401)
                    isNotAuth = res.error
                else swal({
                    title: "Warning.",
                    text: res.message,
                    icon: "warning",
                    button: "OK",
                });

            } else {
                swal({
                    title: "Success.",
                    text: "ลบหมวดหมู่รถเรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshFormCartypeCategory(true);
                setShowEditModal(false);
            }

        }).catch(err => {
            console.log(err);
            history.push("/page500");
        }).finally(value => {
            document.body.style.cursor = 'default';
            setShowLoading(false);
            if (isNotAuth) {
                swal("Warning!", isNotAuth, "warning");
                history.push("/");
                //clear state global at store 
                store.dispatch(disAuthenticationLogin());
            }
        })
    }
    //------------------------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>เพิ่มหมวดหมู่รถ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputEnable
                                title="ชื่อหมวดหมู่รถ (ไทย)"
                                placeholder="Enter cartype category name (Thai)"
                                maxLenght="250"
                                text={cartypeCategoryNameTh}
                                setText={setCartypeCategoryNameTh}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputEnable
                                title="ชื่อหมวดหมู่รถ (Eng)"
                                placeholder="Enter cartype category name (Eng)"
                                maxLenght="250"
                                text={cartypeCategoryNameEn}
                                setText={setCartypeCategoryeNameEn}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputEnable
                                title="ชื่อย่อของหมวดหมู่รถ"
                                placeholder="Enter cartype category contraction name"
                                maxLenght="4"
                                text={cartypeCategoryContractionName}
                                setText={setCartypeCategoryContractionName}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <TextArea
                                title="หมายเหตุ"
                                rows="3"
                                maxLength="250"
                                placeholder="Enter remark"
                                text={remark}
                                setText={setRemark}
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody >
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-class btn-modal-footer"
                        color="danger"
                        onClick={onDisableClick}
                    >
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ลบหมวดหมู่รถ</span>
                    </CButton>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="success" onClick={editCategory}>แก้ไข</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal >
    )
}

export default CartypeCategoryEditModal;