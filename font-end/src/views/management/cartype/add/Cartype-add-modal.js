import { useState } from 'react'
import './Cartype-add-modal.css'
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
} from '@coreui/react'
import { createCartype } from './Cartype-add-modal-controller'
import store, { disAuthenticationLogin } from '../../../../store'

function CartypeAddModal({ showAddModal, setShowAddModal, setRefeshForm, setShowLoading }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [cartypeNameTh, setCartypeNameTh] = useState("");
    const [cartypeNameEn, setCartypeNameEn] = useState("");
    const [cartypeContractionName, setCartypeContractionName] = useState("");
    //-------------Close modal
    function closeModal(event) {
        setShowAddModal(false);
    }
    //--------------Add cartype
    function addCartype(event) {
        const middleware = addCartypeMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                name_th: cartypeNameTh
                , name_en: cartypeNameEn
                , name_contraction: cartypeContractionName
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            createCartype({ authStore, valuesObj })
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
                            text: "เพิ่มประเภทรถเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setShowLoading(false)
                        setRefeshForm(true)
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

    function addCartypeMiddleware() {
        if (!cartypeNameTh) return 'กรุณากรอกชื่อภาษาไทย'
        else if (!cartypeNameEn) return 'กรุณากรอกชื่อภาษาอังกฤษ'
        else if (!cartypeContractionName) return 'กรุณากรอกชื่อย่อ'
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
                <CModalTitle>เพิ่มประเภทรถ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <InputEnable
                        title="ชื่อประเภทรถ (ไทย)"
                        placeholder="Enter cartype name (Thai)"
                        maxLenght="250"
                        text={cartypeNameTh}
                        setText={setCartypeNameTh}
                    />
                    <InputEnable
                        title="ชื่อประเภทรถ (Eng)"
                        placeholder="Enter cartype name (Eng)"
                        maxLenght="250"
                        text={cartypeNameEn}
                        setText={setCartypeNameEn}
                    />
                    <InputEnable
                        title="ชื่อย่อของประเภทรถ"
                        placeholder="Enter cartype contraction name"
                        maxLenght="4"
                        text={cartypeContractionName}
                        setText={setCartypeContractionName}
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item"></div>
                <div className="modal-footer-item">
                <CButton className="btn-modal-footer" color="success" onClick={addCartype}>เพิ่มประเภทรถ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CartypeAddModal;