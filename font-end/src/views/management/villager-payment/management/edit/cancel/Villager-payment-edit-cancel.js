import '../info/Villager-payment-edit-info.css'
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
import TextArea from '../../../../component/textarea/TextArea'
import PropTypes from 'prop-types';
import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../../../store'
import {HaveSpecialHomeFormat} from '../../../../../../utils/utils'
import swal from 'sweetalert'
import {VillagerPaymentSendContactCorporate} from './Villager-payment-edit-cancel-controller'
function VillagerPaymentEditCancel(props) {
    const {
        villagerPaymentObj,
        closeModal,
        setRefeshForm, 
        setShowLoading, 
        setShowInfo,
        setShowCancel,
        setShowApprove,
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------------State
    const [remark,setRemark] = useState("");
    //-----------------------On un approve
    function onCancelClick(event){
        if(cancelMiddleware()){
            sendToContactCorporate();
        }
    }
    function sendToContactCorporate(){
        setShowLoading(true);
            const values = {
                authStore
                , valuesObj: {
                    tpcfi_id: villagerPaymentObj.tpcfi_id
                    ,scfi_code:villagerPaymentObj.scfi_code
                    , remark
                }
            }
            let isNotAuth;
            VillagerPaymentSendContactCorporate(values)
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
                            text: "ทำเรื่องแจ้งลูกบ้านให้ติดต่อเจ้าหน้าที่เรียบร้อย",
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
    //------------------------Middleware
    function cancelMiddleware(){
        if(!remark){
            swal("Warning!", "กรุณากรอกหมายเหตุที่ให้ติดต่อเจ้าหน้าที่", "warning");
            return false;
        }else if(HaveSpecialHomeFormat(remark)){
            swal("Warning!", "หมายเหตุที่ให้ติดต่อเจ้าหน้าที่ ห้ามมีอักขระพิเศษ", "warning");
            return false;
        }return true;
    }
    //----------------------------------------------------------
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
                        <CCol xs="12" sm="12" md="12">
                            <TextArea 
                            text={remark}
                            setText={setRemark} 
                            title="เหตุผลที่ให้ติดต่อเจ้าหน้าที่" 
                            placeholder="Enter remark" 
                            maxLenght="250"
                            rows="3"
                            />
                        </CCol>
                    </CRow>
                    
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                <CButton className="btn-modal-footer btn-cancel-footer"  onClick={onCancelClick}>แจ้งให้ติดต่อเจ้าหน้าที่</CButton>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}
VillagerPaymentEditCancel.propTypes = {
    villagerPaymentObj: PropTypes.any.isRequired,
    closeModal: PropTypes.func.isRequired,
    setShowInfo: PropTypes.func.isRequired,
    setShowCancel: PropTypes.func.isRequired,
    setShowApprove: PropTypes.func.isRequired 
}
export default VillagerPaymentEditCancel;
