import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Common-fee-management-add.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
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
    CLabel,
    CInputFile,
} from '@coreui/react'
import InputEnable from '../../../component/input/InputEnable'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import CommonFeeManagementAddController from './Common-fee-management-add-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import ComboBoxSearchItem from '../../../component/combobox/ComboBoxSearchItem'
import DatePickerInput from '../../../component/datetime/DatePickerInput'
import * as moment from 'moment'
import { IsNumber, HaveSpecialFormat, HaveSpecialHomeFormat } from '../../../../../utils/utils'
const addressText = {
    id: 0, value: 'เลือกบ้าน'
}
const CommonFeeManagementAdd = ({ showAddModal, setShowAddModal, setRefeshForm, setShowLoading, addressArray }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().format("YYYY-MM-DD");
    const dateEnd = moment().add(1, 'days').format("YYYY-MM-DD")
    //--------------------------State
    const [address, setAddress] = useState({ value: "", id: 0 });
    const [squareValue, setSquareValue] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    //--------------------------Form load

    //---------------Datetime handding
    function handdingDateStart(event) {
        if (moment(event) > moment(dateTimeEnd)) {
            const newMoment = moment(event).add(1, 'days').format("YYYY-MM-DD")
            setDateTimeStart(event)
            setDateTimeEnd(newMoment)
        }
        else
            setDateTimeStart(event)
    }
    function handdingDateEnd(event) {
        if (moment(event) < moment(dateTimeStart)) {
            const newMoment = moment(event).subtract(1, 'days').format("YYYY-MM-DD")
            setDateTimeStart(newMoment)
            setDateTimeEnd(event);
        }
        else
            setDateTimeEnd(event)
    }
    //--------------------------Close Modal
    function closeModal(event) {
        setShowAddModal(false);
        setRefeshForm(true);
    }

    function addCommonFeeModal() {
        if (!addCommonFeeMiddleware())
            return;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                home_id: address.id,
                dateFrom: dateTimeStart,
                dateTo: dateTimeEnd,
                squareValue,
                paymentAmount,
                remark,
            }
        }
        let isNotAuth;
        CommonFeeManagementAddController(values).then(res => {
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
                    text: "เพิ่มรายการเรียกเก็บค่าส่วนกลางรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshForm(true)
                closeModal();
            }

        }).catch(err => {
            console.log(err);
            history.push("/page404");
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
    function addCommonFeeMiddleware() {
        if (address.id === 0) {
            swal({
                title: "Warning.",
                text: 'กรุณาเลือกที่อยู่',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!squareValue) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกราคาต่อหน่วยตารางเมตร',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (HaveSpecialFormat(squareValue)) {
            swal({
                title: "Warning.",
                text: 'ราคาต่อหน่วยตารางเมตร ห้ามมีอักขระพิเศษ หรือช่องว่าง',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!IsNumber(squareValue)) {
            swal({
                title: "Warning.",
                text: 'ราคาต่อหน่วยตารางเมตร ต้องเป็นตัวเลขเท่านั้น',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!squareValue) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกค่าส่วนกลาง',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (HaveSpecialFormat(paymentAmount)) {
            swal({
                title: "Warning.",
                text: 'ค่าส่วนกลาง ห้ามมีอักขระพิเศษ หรือช่องว่าง',
                icon: "warning",
                button: "OK",
            });
            return false;
        }else if (!IsNumber(paymentAmount)) {
            swal({
                title: "Warning.",
                text: 'ค่าส่วนกลาง ต้องเป็นตัวเลขเท่านั้น',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (dateTimeStart > dateTimeEnd) {
            swal({
                title: "Warning.",
                text: 'วันที่เริ่มต้องห้าม มากกว่าวันที่สิ้นสุด',
                icon: "warning",
                button: "OK",
            });
            return false;
        }else if(HaveSpecialHomeFormat(remark)){
            swal({
                title: "Warning.",
                text: 'หมายเหตุ ห้ามมีอักขระพิเศษ หรือช่องว่าง',
                icon: "warning",
                button: "OK",
            });
            return false;
        }
        return true;
    }
    //--------------------------------
    return (
        <CModal
            show={showAddModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>ทำรายเพิ่มการเรียกเก็บค่าส่วนกลาง</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสการเรียกเก็บค่าส่วนกลาง"
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <ComboBoxSearchItem
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={addressText}
                                placeholder="Enter adress"
                                itemsArray={addressArray}
                                setText={setAddress}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="10" sm="10" md="10">
                            <InputEnable
                                title="ราคาต่อหน่วยตารางเมตร (บาท)"
                                placeholder="Enter square meter"
                                maxLenght="15"
                                text={squareValue}
                                setText={setSquareValue}
                            />
                        </CCol>
                        <CCol xs="10" sm="10" md="10">
                            <InputEnable
                                title="ค่าส่วนกลาง (บาท)"
                                placeholder="Enter common fee"
                                maxLenght="15"
                                text={paymentAmount}
                                setText={setPaymentAmount}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextArea
                                title="หมายเหตุ"
                                text={remark}
                                setText={setRemark}
                                maxLength={250}
                                rows="3"
                                placeholder="Enter remark"
                            />
                        </CCol>
                    </CRow>

                    <CFormGroup className="time-block">
                        <DatePickerInput
                            title="วันที่เริ่มเก็บค่าส่วนกลาง"
                            text={dateTimeStart}
                            setText={handdingDateStart}
                        />
                        <DatePickerInput
                            title="วันที่สิ้นสุดเก็บค่าส่วนกลาง"
                            text={dateTimeEnd}
                            setText={handdingDateEnd}
                        />
                    </CFormGroup>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <div></div>
                <div>
                    <CButton className="btn-modal-footer" color="success" onClick={addCommonFeeModal}>เพิ่มรายการ</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CommonFeeManagementAdd;