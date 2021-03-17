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
import './Estamp-home-change-modal.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import swal from 'sweetalert';
import moment from 'moment'
import InputDisable from '../../../component/input/InputDisable'
import { EstampHomeChangeModalController } from './Estamp-home-change-modal-controller'
import EstampHomeChangeInfo from './Estamp-home-change-info'
import EstampHomeChangeSelectHome from './Estamp-home-change-home-select'
function EstampHomeChangeModal(props) {
    const { showVisitorModal, setShowVisitorModal, setRefesh } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------State
    const [check, setCheck] = useState(false);
    const [showVisitorInfo, setShowVisitorInfo] = useState(true);
    const [showSelectHome,setShowSelectHome] = useState(false);
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
        if (showVisitorModal.selected) {
            const selectedObj = {
                visitor_record_id: showVisitorModal.visitor_record_id
                , visitor_record_code: showVisitorModal.visitor_record_code
            }
            EstampHomeChangeModalController({ authStore, selectedObj })
                .then((res) => {
                    document.body.style.cursor = 'wait';
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
                        const select = res.result.estamp_flag === 'Y' ? true : false;
                        setCheck(select)
                    } else {
                        setShowVisitorModal({
                            selected: false
                            , visitor_record_id: ""
                            , visitor_record_code: ""
                        });
                        swal("Warning!", res.error, "warning");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page404");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                });
        }
    }, [showVisitorModal])
    //-------------Close modal
    function closeModal(event) {
        setShowVisitorModal({
            selected: false
            , visitor_record_id: ""
            , visitor_record_code: ""
        });
        setCheck(false)
        setRefesh(true);
    }
    //-------------check box
    function onCheckBoxChange(event) {
        if (!event.target.checked) {
            swal({
                title: "ยกเลิกตราประทับ!",
                text: "ต้องการยกเลิกตราประทับหรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        setCheck(false)
                    } else {

                    }
                });
        } else {
            setCheck(true)
        }
    }
    //---------------Save edit
    function onChangeHomeClick(event) {
        if (showVisitorInfo) {
            setShowVisitorInfo(false);
            setShowSelectHome(true);
        } else {
            setShowVisitorInfo(true);
            setShowSelectHome(false);
        }
        // const visitor_record_id = estampInfo.visitor_record_id
        // const visitor_record_code = estampInfo.visitor_record_code
        // const estamp_flag = true;
        // const editEstampObj = {
        //     visitor_record_id
        //     , visitor_record_code
        //     , estamp_flag
        // }
        // EstampModalEditController({ editEstampObj, authStore })
        //     .then(res => {
        //         document.body.style.cursor = 'wait';
        //         if (res.error)
        //             swal({
        //                 title: "Waring.",
        //                 text: res.message,
        //                 icon: "warning",
        //                 button: "OK",
        //             });
        //         else {
        //             swal({
        //                 title: "Success.",
        //                 text: "แก้ตราประทับเรียบร้อย",
        //                 icon: "success",
        //                 button: "OK",
        //             });
        //             closeModal();
        //             setRefesh(true);
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //         history.push('/page404')
        //     }).finally(value => {
        //         document.body.style.cursor = 'default';
        //     })
    }



    //-------------------Show Visitor Info
    let visitorInfoForm = null;
    if (showVisitorInfo) {
        visitorInfoForm = <EstampHomeChangeInfo
            estampInfo={estampInfo}
            onChangeHomeClick={onChangeHomeClick}
            closeModal={closeModal}
        />
    } else visitorInfoForm = null;
    //-------------------Show Home Select
    let selectHomeForm = null;
    if(showSelectHome){
        selectHomeForm = <EstampHomeChangeSelectHome
        estampInfo={estampInfo}
        onChangeHomeClick={onChangeHomeClick}
        closeModal={closeModal}
        />
    }
    //----------------------------------------
    return (
        <CModal
            show={showVisitorModal.selected}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>ทำรายการเปลี่ยนบ้านให้ผู้มาเยือน</CModalTitle>
            </CModalHeader>
            {visitorInfoForm}
            {selectHomeForm}
        </CModal>
    );
}

export default EstampHomeChangeModal;