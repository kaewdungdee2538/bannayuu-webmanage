import { fields, getBadge, getTextStatus } from '../data/estamp-home-change-data'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormGroup,
    CModalFooter,
    CSwitch,
    CButton,
    CRow,
    CCol,
    CBadge,
    CLabel,
} from '@coreui/react'
import InputDisable from '../../../component/input/InputDisable'
import CIcon from '@coreui/icons-react'

export default function EstampHomeChangeInfo(props) {
    const { estampInfo, onChangeHomeClick, closeModal } = props;
    return (
        <div>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable title="ชื่อโครงการ" text={estampInfo.company_name} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="4" md="4">
                            <InputDisable title="Booking code" text={estampInfo.tbv_code} />
                        </CCol>
                        <CCol xs="12" sm="4" md="4">
                            <InputDisable title="Slot number" text={estampInfo.visitor_slot_number} />
                        </CCol>
                        <CCol xs="12" sm="4" md="4">
                            <InputDisable title="Card" text={estampInfo.card_name} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable title="ประเภทรถ" text={estampInfo.cartype_name_th} />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable title="หมวดหมู่รถ" text={estampInfo.cartype_category_name_th} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputDisable title="ชื่อ" text={estampInfo.first_name_th} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputDisable title="นามสกุล" text={estampInfo.last_name_th} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <InputDisable title="เบอร์โทรศัพท์" text={estampInfo.tel_number} />
                        </CCol>
                        <CCol xs="12" sm="6">
                            <InputDisable title="ทะเบียนรถ" text={estampInfo.license_plate} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <InputDisable title="ประเภทผู้มาเยือน" text={estampInfo.idividule_type} />
                        </CCol>
                        <CCol xs="12" sm="6">
                            <InputDisable title="บุคคลที่มาติดต่อ" text={estampInfo.person_contract} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <InputDisable title="บ้านที่มาติดต่อ" text={estampInfo.home_address} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <InputDisable title="ทำรายการเข้าผ่าน" text={estampInfo.record_from} />
                        </CCol>
                        <CCol xs="12" sm="6">
                            <InputDisable title="เวลาเข้า" text={estampInfo.parking_in_datetime} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CLabel>สถานะตราประทับ</CLabel><br></br>
                            <CBadge color={getBadge(getTextStatus(estampInfo.estamp_flag))} className="estamp-status">
                                {getTextStatus(estampInfo.estamp_flag)}
                            </CBadge>
                        </CCol>
                        <CCol xs="12" sm="6">

                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <InputDisable title="ประทับตราจาก" text={estampInfo.estamp_form} />
                        </CCol>
                        <CCol xs="12" sm="6">
                            <InputDisable title="เวลาที่มีการประทับตรา" text={estampInfo.estamp_datetime} />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="switch-footer">
                </div>
                <div>
                    <CButton className="btn-modal-footer" color="primary" onClick={onChangeHomeClick}>
                        <CIcon
                            name="cil-fullscreen-exit"
                            color="info" />
                        <span className="btn-icon-footer">เปลี่ยนบ้านให้ผู้มาเยือน</span>
                    </CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}