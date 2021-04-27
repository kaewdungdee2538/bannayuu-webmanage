import './Villager-payment-edit-info.css'
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
import ImageBox from '../../../../component/image/ImageBox'
import InputEnable from '../../../../component/input/InputEnable'
import { getBadge, getTextStatus } from '../../data/villager-payment-management-data'
import PropTypes from 'prop-types';

function VillagerPaymentEditInfo(props) {
    const {
        villagerPaymentObj,
        imageBill,
        closeModal,
        setShowInfo,
        setShowCancel,
        setShowApprove
    } = props;
    function onApproveClick(event) {
        setShowInfo(false);
        setShowApprove(true);
    }
    function onCancelClick(event){
        setShowInfo(false);
        setShowCancel(true);
    }
    //----------------------------------------------
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
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่รายการ"
                                text={villagerPaymentObj.create_date}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้ชำระเงิน"
                                text={villagerPaymentObj.create_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่ชำระเงิน"
                                text={`${villagerPaymentObj.payment_date} ${villagerPaymentObj.payment_time}`}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ธนาคารที่ทำรายการ"
                                text={villagerPaymentObj.m_bank}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพใบเสร็จชำระเงิน"
                                isNotStandard={true}
                                link={imageBill}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CLabel>สถานะ</CLabel>
                            <br></br>
                            <CBadge className="badge-modal" color={getBadge(villagerPaymentObj.status)}>
                                {getTextStatus(villagerPaymentObj.status)}
                            </CBadge>
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer btn-cancel-footer" onClick={onCancelClick}>แจ้งให้ติดต่อเจ้าหน้าที่</CButton>
                    <CButton className="btn-modal-footer" color="success" onClick={onApproveClick}>ยืนยันการชำระเงิน</CButton>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}
VillagerPaymentEditInfo.propTypes = {
    villagerPaymentObj: PropTypes.any.isRequired,
    closeModal: PropTypes.func.isRequired,
    setShowInfo: PropTypes.func.isRequired,
    setShowCancel: PropTypes.func.isRequired,
    setShowApprove: PropTypes.func.isRequired
}
export default VillagerPaymentEditInfo;
