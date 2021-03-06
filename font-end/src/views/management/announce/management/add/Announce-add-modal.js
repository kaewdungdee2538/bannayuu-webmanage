import { useState } from 'react'
import './Announce-add-modal.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import InputEnable from '../../../component/input/InputEnable'
import TextArea from '../../../component/textarea/TextArea'
import InlineDatePickerDemo from '../../../component/datetime/DatetimePickerInput'
import addAnnouceModal from './Announce-add-modal-controller'
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
} from '@coreui/react'
import moment from 'moment'
import store, { disAuthenticationLogin } from '../../../../../store'
import {checkFileNotOver10Mb} from '../../../../../utils/utils'

function AnnouceAddModal({ showAddAnnouce, setShowAddAnnouce, setRefeshForm, setShowLoading }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').format("YYYY-MM-DDTHH:mm")
    //-------------State
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('Choose image');
    const [announceName, setAnnounceName] = useState('');
    const [announceHead, setAnnounceHead] = useState('');
    const [announceRemark, setAnnounceRemark] = useState('');
    const [announceDetail, setAnnounceDetail] = useState('');
    const [announceLink, setAnnounceLink] = useState('')
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    //-------------Close modal
    function closeModal(event) {
        setShowAddAnnouce(false);
    }
    //--------------Add Annouce
    function addAnnouce(event) {
        const middleware = addAnnouceMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const announceObj = {
                hni_name: announceName
                , hni_start_datetime: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString()
                , hni_end_datetime: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
                , hni_header_text: announceHead
                , hni_detail_text: announceDetail
                , hni_link_text: announceLink
                , hni_remark: announceRemark
                , ref_hni_id: null
                , image
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            addAnnouceModal({ authStore, announceObj })
                .then(res => {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error
                        } else swal({
                            title: "Warning.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                        setShowLoading(false)
                    } else {
                        swal({
                            title: "Success.",
                            text: "เพิ่มประกาศเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setRefeshForm(true)
                        closeModal();
                        setShowLoading(false)
                    }
                    document.body.style.cursor = 'default';
                }).catch((err) => {
                    console.log(err);
                    history.push("/page500");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }

    function addAnnouceMiddleware() {
        if (dateTimeStart >= dateTimeEnd)
            return 'ช่วงเวลาประกาศจะต้องไม่เท่ากัน'
        else if (!announceName)
            return 'กรุณากรอกชื่อเรื่อง'
        else if (!announceHead)
            return 'กรุณากรอกหัวประกาศ'
        else if (!announceDetail)
            return 'กรุณากรอกรายละเอียดของประกาศ'
        else if (!checkFileNotOver10Mb(image))
            return 'รูปภาพห้ามมีขนาดเกิน 10 Mb'
        return null;
    }

    //---------------Datetime handding
    function handdingDateStart(event) {
        if (moment(event) > moment(dateTimeEnd)) {
            const newMoment = moment(event).add(1, 'h').format("YYYY-MM-DDTHH:mm")
            setDateTimeStart(event)
            setDateTimeEnd(newMoment)
        }
        else
            setDateTimeStart(event)
    }
    function handdingDateEnd(event) {
        if (moment(event) < moment(dateTimeStart)) {
            const newMoment = moment(event).subtract(1, 'h').format("YYYY-MM-DDTHH:mm")
            setDateTimeStart(newMoment)
            setDateTimeEnd(event);
        }
        else
            setDateTimeEnd(event)
    }

    return (
        <CModal
            show={showAddAnnouce}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>เพิ่มประกาศ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <InputEnable
                        title="ชื่อประกาศ"
                        placeholder="Enter announce name"
                        maxLenght="250"
                        text={announceName}
                        setText={setAnnounceName}
                    />
                    <InputEnable
                        title="หัวข้อประกาศ"
                        placeholder="Enter announce header"
                        maxLenght="250"
                        text={announceHead}
                        setText={setAnnounceHead}
                    />
                    <TextArea
                        title="รายละเอียดประกาศ"
                        placeholder="Enter detail"
                        maxLenght="250"
                        text={announceDetail}
                        setText={setAnnounceDetail}
                        rows="3"
                    />
                    <InputEnable
                        title="หมายเหตุ"
                        placeholder="Enter remark"
                        maxLenght="250"
                        text={announceRemark}
                        setText={setAnnounceRemark}
                    />
                    <InputEnable
                        title="ลิงค์อ้างอิง"
                        placeholder="Enter reference link"
                        maxLenght="250"
                        text={announceLink}
                        setText={setAnnounceLink}
                    />
                    <br></br>
                    <CRow>
                        <CCol xs="12" md="12">
                            <CLabel>เลือกรูปภาพ</CLabel>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" name="filename"
                                    accept="image/*"
                                    onChange={async (event) => {
                                        const file = event.target.files.item(0);
                                        setImage(file)
                                        setFileName(file.name)
                                    }
                                    } />
                                <label className="custom-file-label" htmlFor="customFile">{fileName}</label>
                            </div>
                        </CCol>
                    </CRow>
                </CFormGroup>

                <CFormGroup className="time-block">
                    <InlineDatePickerDemo
                        title="เวลาเริ่มประกาศ"
                        text={dateTimeStart}
                        setText={handdingDateStart}
                    />
                    <InlineDatePickerDemo
                        title="เวลาสิ้นสุดประกาศ"
                        text={dateTimeEnd}
                        setText={handdingDateEnd}
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton className="btn-modal-footer" color="success" onClick={addAnnouce}>เพิ่มประกาศ</CButton>
                <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AnnouceAddModal;