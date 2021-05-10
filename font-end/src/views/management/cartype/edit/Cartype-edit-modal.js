import { useState, useEffect } from 'react'
import './Cartype-edit-modal.css'
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
import InputDisable from '../../component/input/InputDisable'
import TextArea from '../../component/textarea/TextArea'
import { editCartype, getCartypeById, disableCartypeById } from './Cartype-edit-modal-controller'
import store, { disAuthenticationLogin } from '../../../../store'

function CartypeEditModal({ showEditModal, setShowEditModal, setRefeshForm, setShowLoading, selectedObj }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [cartypeInfo, setCartypeInfo] = useState({
        cartype_id: "",
        cartype_code: "",
        cartype_name_th: "",
        cartype_name_en: "",
        cartype_name_contraction: "",
        create_by: null,
        create_date: null,
        update_by: null,
        update_date: null,
        remark: "",
        company_name: ""
    });
    const [cartypeNameTh, setCartypeNameTh] = useState("");
    const [cartypeNameEn, setCartypeNameEn] = useState("");
    const [cartypeContractionName, setCartypeContractionName] = useState("");
    const [remark, setRemark] = useState("");
    //-------------Form load
    useEffect(() => {
        const valuesObj = {
            cartype_id: selectedObj.cartype_id
        }
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = "wait";
        getCartypeById({ valuesObj, authStore })
            .then((res) => {
                if (res.result) {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error
                        } else swal({
                            title: "Waring.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                        closeModal();
                    } else {
                        const result = res.result;
                        setCartypeInfo(result);
                        setCartypeNameTh(result.cartype_name_th);
                        setCartypeNameEn(result.cartype_name_en);
                        setCartypeContractionName(result.cartype_name_contraction);
                        setRemark(result.remark);
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
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
    }, [])
    //-------------Close modal
    function closeModal(event) {
        setShowEditModal(false);
    }
    //--------------edit cartype
    function onEditCartype() {
        const middleware = editCartypeMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                cartype_id: cartypeInfo.cartype_id
                , name_th: cartypeNameTh
                , name_en: cartypeNameEn
                , name_contraction: cartypeContractionName
                , remark
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            editCartype({ authStore, valuesObj })
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
                            text: "แก้ไขประเภทรถเรียบร้อย",
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

    function editCartypeMiddleware() {
        if (!cartypeNameTh) return 'กรุณากรอกชื่อภาษาไทย'
        else if (!cartypeNameEn) return 'กรุณากรอกชื่อภาษาอังกฤษ'
        else if (!cartypeContractionName) return 'กรุณากรอกชื่อย่อ'
        else if (!remark) return 'กรุณากรอกหมายเหตุ'
        return null;
    }
    //--------------Disable cartype
    function onDisableCartype() {
        const disableMw = disableMiddleware();
        if (disableMw)
            swal("Warning!", disableMw, "warning");
        else
            swal({
                title: "Are you sure?",
                text: "ต้องการลบประเภทรถ หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        disableCartype();
                    }
                });

    }
    function disableCartype() {
        const valuesObj = {
            cartype_id: cartypeInfo.cartype_id
            , remark
        }
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = 'wait';
        disableCartypeById({ authStore, valuesObj })
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
                        text: "ลบประเภทรถเรียบร้อย",
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
    function disableMiddleware() {
        if (!remark) return 'กรุณากรอกหมายเหตุ'
        return null;
    }
    //----------------------------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขประเภทรถ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อหมู่โครงการ"
                                text={cartypeInfo.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="รหัสประเภทรถ"
                                text={cartypeInfo.cartype_code}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ชื่อประเภทรถ (ไทย)"
                                placeholder="Enter cartype name (Thai)"
                                maxLenght="250"
                                text={cartypeNameTh}
                                setText={setCartypeNameTh}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ชื่อประเภทรถ (Eng)"
                                placeholder="Enter cartype name (Eng)"
                                maxLenght="250"
                                text={cartypeNameEn}
                                setText={setCartypeNameEn}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="ชื่อย่อของประเภทรถ"
                                placeholder="Enter cartype contraction name"
                                maxLenght="4"
                                text={cartypeContractionName}
                                setText={setCartypeContractionName}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextArea
                                title="หมายเหตุ"
                                placeholder="Enter detail"
                                maxLenght="250"
                                text={remark}
                                setText={setRemark}
                                rows="3"
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="danger" onClick={onDisableCartype}>ยกเลิกใช้งาน</CButton>
                </div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="success" onClick={onEditCartype}>แก้ไขประเภทรถ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CartypeEditModal;