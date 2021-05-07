import '../Villager-payment-history-modal.css'
import {
    CModalBody,
    CModalFooter,
    CFormGroup,
    CRow,
    CCol,
    CLabel,
    CBadge,
    CButton,
} from '@coreui/react'
import InputDisable from '../../../../component/input/InputDisable'
import TextAreaDisable from '../../../../component/textarea/TextAreaDisable'
import { getBadge } from '../../data/villager-payment-history-data'
import PropTypes from 'prop-types';

function VillagerPaymentHistoryCreditType(props) {
    const {
        villagerPaymentObj,
        // imageBill,
        closeModal,
    } = props;

    //----------------------------------------------
    return (
        <div>
            <CModalBody>
                <h2>ชำระเงินผ่านบัตรเครดิต</h2>
                <br></br>
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
                                title="รหัสเรียกเก็บค่าใช้จ่าย"
                                text={villagerPaymentObj.scfi_code}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสการชำระเงินของลูกบ้าน"
                                text={villagerPaymentObj.tpcfi_code}
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
                            <InputDisable
                                title="Credit/Debit"
                                text={villagerPaymentObj.credit_financing}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="ประเภทบัตร"
                                text={villagerPaymentObj.credit_brand}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่ชำระเงิน"
                                text={villagerPaymentObj.create_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้ชำระเงิน"
                                text={villagerPaymentObj.credit_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ธนาคาร"
                                text={villagerPaymentObj.credit_bank}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="จำนวนเงินที่ชำระ (บาท)"
                                text={villagerPaymentObj.credit_funding_amount}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="หมายเหตุ"
                                text={villagerPaymentObj.tpcfi_remark}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CLabel>สถานะ</CLabel>
                            <br></br>
                            <CBadge className="badge-modal" color={getBadge(villagerPaymentObj.status)}>
                                {villagerPaymentObj.workflow_name}
                            </CBadge>
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}
VillagerPaymentHistoryCreditType.propTypes = {
    villagerPaymentObj: PropTypes.any.isRequired,
    closeModal: PropTypes.func.isRequired,
}
export default VillagerPaymentHistoryCreditType;
