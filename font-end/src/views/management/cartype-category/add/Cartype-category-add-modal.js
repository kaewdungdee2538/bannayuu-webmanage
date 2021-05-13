import { useState } from 'react'
import './Cartype-category-add-modal.css'
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
import { createCartypeCategory } from './Cartype-category-add-modal-controller'
import store, { disAuthenticationLogin } from '../../../../store'

function CartypeCategoryAddModal({ showAddModal, setShowAddModal, setRefeshFormCartypeCategory, setShowLoading }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cartype_id = authStore.cartype_id;
    //-------------State
    const [cartypeCategoryNameTh, setCartypeCategoryNameTh] = useState("");
    const [cartypeCategoryNameEn, setCartypeCategoryeNameEn] = useState("");
    const [cartypeCategoryContractionName, setCartypeCategoryContractionName] = useState("");
    //-------------Close modal
    function closeModal() {
        setShowAddModal(false);
    }
    //--------------Add cartype
    function addCartypeCategory() {
        const middleware = addCartypeCategoryMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                cartype_id
                , name_th: cartypeCategoryNameTh
                , name_en: cartypeCategoryNameEn
                , name_contraction: cartypeCategoryContractionName
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            createCartypeCategory({ authStore, valuesObj })
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
                            text: "เพิ่มหมวดหมู่รถเรียบร้อย",
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

    function addCartypeCategoryMiddleware() {
        if (!cartype_id) return 'ไม่พบรหัสยืนยันประเภทรถ กรุณาย้อนกลับไปเลือกประเภทรถใหม่อีกครั้ง'
        if (!cartypeCategoryNameTh) return 'กรุณากรอกชื่อภาษาไทย'
        else if (!cartypeCategoryNameEn) return 'กรุณากรอกชื่อภาษาอังกฤษ'
        else if (!cartypeCategoryContractionName) return 'กรุณากรอกชื่อย่อ'
        return null;
    }


    return (
        <CModal
            show={showAddModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
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
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item"></div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="success" onClick={addCartypeCategory}>เพิ่มหมวดหมู่รถ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CartypeCategoryAddModal;