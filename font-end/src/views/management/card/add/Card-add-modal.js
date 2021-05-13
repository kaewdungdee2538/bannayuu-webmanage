import { useState } from 'react'
import './Card-add-modal.css'
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
import { addCardRFID } from './Card-add-controller'
import store, { disAuthenticationLogin } from '../../../../store'

function CardAddModal({ showAddModal, setShowAddModal, setRefeshForm, setShowLoading }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [cardId, setCardId] = useState("");
    const [cardName, setCardName] = useState("");
    //-------------Close modal
    function closeModal() {
        setShowAddModal(false);
    }
    //--------------Add card
    function onAddCard() {
        const middleware = addCardMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const valuesObj = {
                card_code: cardId,
                card_name: cardName
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            addCardRFID({ authStore, valuesObj })
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
                            text: "เพิ่มบัตรเรียบร้อย",
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

    function addCardMiddleware() {
        if (!cardId) return 'กรุณากรอกรหัสบัตร'
        else if (!cardName) return 'กรุณากรอกเลขบัตร'
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
                <CModalTitle>เพิ่มบัตร RFID</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="รหัสบัตร (เลือกกล่องข้อความแล้วทาบบัตร)"
                                placeholder="Enter Card ID"
                                maxLenght="20"
                                text={cardId}
                                setText={setCardId}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputEnable
                                title="เลขหน้าบัตร"
                                placeholder="Enter Card Name"
                                maxLenght="15"
                                text={cardName}
                                setText={setCardName}
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item"></div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="success" onClick={onAddCard}>เพิ่มบัตร</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CardAddModal;