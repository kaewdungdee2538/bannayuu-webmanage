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

export default function EstampHomeChangeSelectHome(props) {
    const { estampInfo, onChangeHomeClick, closeModal } = props;
    return (
        <div>
            <CModalBody>
                <CFormGroup>
                    
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="switch-footer">
                </div>
                <div>
                    {/* <CButton className="btn-modal-footer" color="primary" onClick={onChangeHomeClick}>
                        <CIcon
                            name="cil-fullscreen-exit"
                            color="info" />
                        <span className="btn-icon-footer">เปลี่ยนบ้านให้ผู้มาเยือน</span>
                    </CButton> */}
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}