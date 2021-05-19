import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormGroup,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CBadge,
    CLabel,
} from '@coreui/react'
import './Estamp-history-modal.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import { getBadge, getTextStatus } from '../data/estamp-history-main-data'
import InputDisable from '../../../component/input/InputDisable'
import { EstampHistoryModalController } from './Estamp-history-modal-controller'
import store, { disAuthenticationLogin } from '../../../../../store'

function EstampHistoryModal(props) {
    const { showEstampInfo, setShowEstampInfo, setRefesh, setShowLoading } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [estampInfo, setEstampInfo] = useState({
        visitor_record_id: "",
        visitor_record_code: "",
        tbv_code: "",
        visitor_slot_number: "",
        card_name: "",
        cartype_name_th: "",
        cartype_category_name_th: "",
        first_name_th: "",
        last_name_th: "",
        tel_number: "",
        idividule_type: "",
        person_contract: "",
        home_address: "",
        license_plate: "",
        parking_in_datetime: "",
        estamp_flag: "",
        estamp_datetime: "",
        estamp_form: "",
        record_from: "",
        company_name: "",
    });
    //-------------Form load
    useEffect(() => {
        if (showEstampInfo.selected) {
            const selectedObj = {
                visitor_record_id: showEstampInfo.visitor_record_id
                , visitor_record_code: showEstampInfo.visitor_record_code
            }
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = 'wait';
            EstampHistoryModalController({ authStore, selectedObj })
                .then((res) => {
                    if (res.result) {
                        setEstampInfo({
                            visitor_record_id: res.result.visitor_record_id,
                            visitor_record_code: res.result.visitor_record_code,
                            tbv_code: !res.result.tbv_code ? '-' : res.result.tbv_code,
                            visitor_slot_number: !res.result.visitor_slot_number ? '-' : res.result.visitor_slot_number,
                            card_name: !res.result.card_name ? '-' : res.result.card_name,
                            cartype_name_th: !res.result.cartype_name_th ? '-' : res.result.cartype_name_th,
                            cartype_category_name_th: !res.result.cartype_category_name_th ? '-' : res.result.cartype_category_name_th,
                            first_name_th: !res.result.first_name_th ? '-' : res.result.first_name_th,
                            last_name_th: !res.result.last_name_th ? '-' : res.result.last_name_th,
                            tel_number: !res.result.tel_number ? '-' : res.result.tel_number,
                            idividule_type: !res.result.idividule_type ? '-' : res.result.idividule_type,
                            person_contract: !res.result.person_contract ? '-' : res.result.person_contract,
                            home_address: !res.result.home_address ? '-' : res.result.home_address,
                            license_plate: !res.result.license_plate ? '-' : res.result.license_plate,
                            parking_in_datetime: !res.result.parking_in_datetime ? '-' : res.result.parking_in_datetime,
                            estamp_flag: !res.result.estamp_flag ? '-' : res.result.estamp_flag,
                            estamp_datetime: !res.result.estamp_datetime ? '-' : res.result.estamp_datetime,
                            estamp_form: !res.result.estamp_form ? '-' : res.result.estamp_form,
                            record_from: !res.result.record_from ? '-' : res.result.record_from,
                            company_name: !res.result.company_name ? '-' : res.result.company_name,
                        });
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error
                    } else {
                        setEstampInfo({ ...estampInfo });
                        setShowEstampInfo({
                            selected: false
                            , visitor_record_id: ""
                            , visitor_record_code: ""
                        });
                        swal("Warning!", res.error, "warning");
                    }
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
        }
    }, [showEstampInfo])
    //-------------Close modal
    function closeModal(event) {
        setShowEstampInfo({
            selected: false
            , visitor_record_id: ""
            , visitor_record_code: ""
        });
    }

    return (
        <CModal
            show={showEstampInfo.selected}
            onClose={closeModal}
            closeOnBackdrop={false}
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-history">
                <CModalTitle>ข้อมูลผู้มาเยือน</CModalTitle>
            </CModalHeader>
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
                    {/* <CRow>
                        <CCol xs="12" sm="6">
                            <InputDisable title="ประเภทผู้มาเยือน" text={estampInfo.idividule_type} />
                        </CCol>
                        <CCol xs="12" sm="6">
                            <InputDisable title="บุคคลที่มาติดต่อ" text={estampInfo.person_contract} />
                        </CCol>
                    </CRow> */}
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
                            <CBadge color={getBadge(estampInfo.estamp_flag)} className="estamp-status">
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
                <div>
                </div>
                <div className="modal-footer-item">
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    );
}

export default EstampHistoryModal;