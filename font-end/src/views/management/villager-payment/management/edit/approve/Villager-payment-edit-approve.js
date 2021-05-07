import '../info/Villager-payment-edit-info.css'
import {
    CModalBody,
    CModalFooter,
    CFormGroup,
    CRow,
    CCol,
    CButton,
} from '@coreui/react'
import swal from 'sweetalert'
import InputDisable from '../../../../component/input/InputDisable'
import InputEnable from '../../../../component/input/InputEnable'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../../../store'
import { useState } from 'react'
import { IsNumber, HaveSpecialFormat } from '../../../../../../utils/utils'
import { VillagerPaymentApprove } from './Villager-payment-edit-approve-controller'
function VillagerPaymentEditApprove(props) {
    const {
        villagerPaymentObj,
        closeModal,
        setRefeshForm, 
        setShowLoading,
        // setShowInfo,
        // setShowCancel,
        // setShowApprove,
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------------State
    const [villagerAmount, setVillagerAmount] = useState(null);

    //-------------------On Approve
    function onApproveClick(event) {
        if (approveMiddleware()) {
            approveVillagerPayment();
        }
    }
    function approveVillagerPayment(){
        setShowLoading(true);
            const values = {
                authStore
                , valuesObj: {
                    tpcfi_id: villagerPaymentObj.tpcfi_id
                    ,scfi_code:villagerPaymentObj.scfi_code
                    ,villager_payment_amount:villagerAmount
                    , remark: ""
                }
            }
            let isNotAuth;
            VillagerPaymentApprove(values)
                .then(res => {
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
                            text: "ยันยืนการชำระเงินเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setRefeshForm(true)
                        closeModal();
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
    //----------------------Middleware
    function approveMiddleware() {
        if (!villagerAmount) {
            swal("Warning!", "กรุณากรอกจำนวนเงินที่ชำระ", "warning");
            return false;
        } else if (HaveSpecialFormat(villagerAmount)) {
            swal("Warning!", "จำนวนเงินที่ชำระ ห้ามมีอักขระพิเศษ หรือช่องว่าง", "warning");
            return false;
        } else if (!IsNumber(villagerAmount)) {
            swal("Warning!", "จำนวนเงินที่ชำระ ต้องเป็นตัวเลขเท่านั้น", "warning");
            return false;
        }
        // else if (!paymentStatus) {
        //     swal("Warning!", "กรุณาเลือกว่าชำระเงินครบถ้วน หรือไม่?", "warning");
        //     return false;
        // } 
        return true;
    }
    //-----------------------------------------------------
    return (
        <div>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={villagerPaymentObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่ (ผู้ชำระเงิน)"
                                text={villagerPaymentObj.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="ประเภทการเรียกเก็บค่าใช้จ่าย"
                                text={villagerPaymentObj.payment_event_name}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="จำนวนเงินที่เรียกเก็บ"
                                text={villagerPaymentObj.payment_amount}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputEnable
                                text={villagerAmount}
                                setText={setVillagerAmount}
                                title="กรอกจำนวนเงินที่ชำระ (บาท)"
                                placeholder="Enter villager payment amount"
                                maxLenght="10"
                            />
                        </CCol>
                    </CRow>
                    {/* <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <CLabel>จำนวนเงินถูกต้อง หรือไม่?</CLabel>
                            <br></br>
                            <CFormGroup variant="custom-radio" inline onClick={
                                event => {
                                    setPaymentStatus('complete')
                                }
                            }>
                                <CInputRadio custom id="inline-radio1" name="inline-radios" value="option1" />
                                <CLabel variant="custom-checkbox" htmlFor="inline-radio1">ครบถ้วน</CLabel>
                            </CFormGroup>
                            <CFormGroup variant="custom-radio" inline
                                onClick={
                                    event => {
                                        setPaymentStatus('incomplete')
                                    }
                                }>
                                <CInputRadio custom id="inline-radio2" name="inline-radios" value="option2" />
                                <CLabel variant="custom-checkbox" htmlFor="inline-radio2">ไม่ครบจำนวน</CLabel>
                            </CFormGroup>
                        </CCol>
                    </CRow> */}
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="success" onClick={onApproveClick}>ยืนยันการชำระเงิน</CButton>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}
VillagerPaymentEditApprove.propTypes = {
    villagerPaymentObj: PropTypes.any.isRequired,
    closeModal: PropTypes.func.isRequired,
    setShowInfo: PropTypes.func.isRequired,
    setShowCancel: PropTypes.func.isRequired,
    setShowApprove: PropTypes.func.isRequired
}
export default VillagerPaymentEditApprove;
