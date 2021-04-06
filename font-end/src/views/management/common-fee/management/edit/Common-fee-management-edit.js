import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Common-fee-management-edit.css'
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
import { CommonFeeManagementEditController, CommonFeeManagementGetById, saveCancelCommonFee } from './Common-fee-management-edit-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import ComboBoxSearchItem from '../../../component/combobox/ComboBoxSearchItem'
import DatePickerInput from '../../../component/datetime/DatePickerInput'
import * as moment from 'moment'
import { IsNumber, HaveSpecialFormat, HaveSpecialHomeFormat } from '../../../../../utils/utils'
import CIcon from '@coreui/icons-react'

const CommonFeeManagementEdit = ({ selectCommon, showEditModal, setShowEditModal, setRefeshForm, setShowLoading, addressArray }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().format("YYYY-MM-DD");
    const dateEnd = moment().add(1, 'days').format("YYYY-MM-DD")
    //--------------------------State
    const [address, setAddress] = useState({ id: 0, value: 'เลือกบ้าน' });
    const [squareValue, setSquareValue] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [commonFeeObj, setCommonFeeObj] = useState({
        scfi_id: "",
        scfi_code: "",
        home_id: 0,
        home_address: "",
        date_from: "",
        date_to: "",
        payment_event_id: "",
        payment_amount: "",
        square_value: "",
        create_date: "",
        create_by: "",
        update_date: "",
        update_by: "",
        remark: "",
        delete_date: "",
        delete_by: "",
        company_name: ""
    });
    //--------------------------Form load
    useEffect(() => {
        let isNotAuth;
        document.body.style.cursor = "wait";
        setShowLoading(true)
        CommonFeeManagementGetById({ authStore, selectCommon })
            .then((res) => {
                if (res.result) {
                    setCommonFeeObj(res.result);
                    const squareValue = res.result.square_value
                    const paymentAmount = res.result.payment_amount
                    const dateStart = moment(res.result.date_from).format("YYYY-MM-DD")
                    const dateEnd = moment(res.result.date_to).format("YYYY-MM-DD")
                    const remarkText = res.result.remark
                    const addre = { id: res.result.home_id, value: res.result.home_address }
                    setAddress(addre)
                    setSquareValue(squareValue)
                    setPaymentAmount(paymentAmount)
                    setDateTimeStart(dateStart)
                    setDateTimeEnd(dateEnd)
                    setRemark(remarkText)
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
                } else swal("Warning!", res.error, "warning");
            })
            .catch((err) => {
                console.log(err);
                history.push("/page404");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                setRefeshForm(false);
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }, []);
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
        setShowEditModal(false);
        setRefeshForm(true);
    }
    //--------------------------Show combobox
    let elemComboBoxHomeAddress = null;
    if (address.id > 0) {
        elemComboBoxHomeAddress = <ComboBoxSearchItem
            title="บ้านเลขที่ (ลูกบ้าน)"
            text={address}
            placeholder="Enter adress"
            itemsArray={addressArray}
            setText={setAddress}
        />
    }
    //--------------------------Edit
    function editCommonFeeModal() {
        if (!editCommonFeeMiddleware())
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
                scfi_id: commonFeeObj.scfi_id
            }
        }
        let isNotAuth;
        CommonFeeManagementEditController(values).then(res => {
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
                    text: "แก้ไขรายการเรียกเก็บค่าส่วนกลางรียบร้อย",
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
    function editCommonFeeMiddleware() {
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
        } else if (!IsNumber(paymentAmount)) {
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
        } else if (HaveSpecialHomeFormat(remark)) {
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
    //-------------------------------on cancel click
    function onClickSaveCancel() {
        if (cancelCommonFeeMiddleware()) {
            swal({
                title: "Are you sure?",
                text: "ต้องการยกเลิกการเรียกเก็บค่าส่วนกลาง หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        cancelCommonFeeSave();
                    }
                });
        }
    }
    function cancelCommonFeeSave(){
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , valuesObj: {
                scfi_id: commonFeeObj.scfi_id
                , remark: remark
            }
        }
        let isNotAuth;
        saveCancelCommonFee(values).then(res => {
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
                    text: "ยกเลิกรายการเรียกเก็บค่าส่วนกลางเรียบร้อย",
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
    //--------------------------------Cancel middle ware
    function cancelCommonFeeMiddleware() {
        if (!commonFeeObj.scfi_id) {
            swal({
                title: "Warning.",
                text: 'ยกเลิกรายการเรียกเก็บค่าส่วนกลางล้มเหลว\nกรุณาทำเลือกรายการแก้ไขใหม่',
                icon: "warning",
                button: "OK",
            });
            return false;
        } else if (!remark) {
            swal({
                title: "Warning.",
                text: 'กรุณากรอกหมายเหตุ',
                icon: "warning",
                button: "OK",
            });
            return false;
        }else if(HaveSpecialHomeFormat(remark)){
            swal({
                title: "Warning.",
                text: 'หมายเหตุ ห้ามมีอักขระพิเศษ',
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
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขการเรียกเก็บค่าส่วนกลาง</CModalTitle>
            </CModalHeader>
            <CModalBody>

                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={commonFeeObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสการเรียกเก็บค่าส่วนกลาง"
                                text={commonFeeObj.scfi_code}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="สร้างโดย"
                                text={commonFeeObj.create_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="สร้างเมื่อ"
                                text={commonFeeObj.create_date}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            {elemComboBoxHomeAddress}
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
            <CModalFooter className="modal-footer">
                <div>
                    <CButton className="btn-modal-footer" color="danger" onClick={onClickSaveCancel}>
                        <CIcon
                            name="cil-ban"
                            color="info" />
                        <span className="btn-icon-footer">ยกเลิกการเรียกเก็บ</span>
                    </CButton>
                </div>
                <div>
                    <CButton className="btn-modal-footer" color="primary" onClick={editCommonFeeModal}>แก้ไข</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default CommonFeeManagementEdit;