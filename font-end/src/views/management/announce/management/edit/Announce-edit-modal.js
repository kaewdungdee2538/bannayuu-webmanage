import './Announce-edit-modal.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import InputEnable from '../../../component/input/InputEnable'
import TextArea from '../../../component/textarea/TextArea'
import InlineDatePickerDemo from '../../../component/datetime/DatetimePickerInput'
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
import { getAnnouceByIdModal, editAnnouceModal } from './Announce-edit-modal-controller'
import InputDisable from '../../../component/input/InputDisable'
import ImageBox from '../../../component/image/ImageBox'
import store, { disAuthenticationLogin } from '../../../../../store'
import {checkFileNotOver10Mb} from '../../../../../utils/utils'

function AnnouceEditModal({ showEdit, setShowEdit, setRefeshForm, editObj, setShowLoading }) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const dateState = moment().format("YYYY-MM-DDTHH:mm");
    const dateEnd = moment().add(1, 'days').format("YYYY-MM-DDTHH:mm")
    //-------------State
    const [hni_id, setHni_id] = useState('');
    const [ref_hni_id, setRef_hni_id] = useState('')
    const [hni_code, setHni_code] = useState('')
    const [hni_data, setHni_data] = useState(null)
    const [announceName, setAnnounceName] = useState('');
    const [announceHead, setAnnounceHead] = useState('');
    const [announceRemark, setAnnounceRemark] = useState('');
    const [announceDetail, setAnnounceDetail] = useState('');
    const [announceLink, setAnnounceLink] = useState('')
    const [dateTimeStart, setDateTimeStart] = useState(dateState);
    const [dateTimeEnd, setDateTimeEnd] = useState(dateEnd);
    const [company_name, setCompany_name] = useState('');
    const [imageHni, setImageHni] = useState(null);
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('Choose new image');
    //-------------Form load
    useEffect(() => {
        const announceObj = {
            hni_id: editObj.hni_id
        }
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = "wait";
        getAnnouceByIdModal({ announceObj, authStore })
            .then((res) => {
                if (res.result) {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error
                        } else swal({
                            title: "Waring.",
                            text: res.message,
                            icon: "warning",
                            button: "OK",
                        });
                        closeModal();
                    } else {
                        const hni_id = res.result.hni_id
                        const ref_hni_id = res.result.ref_hni_id
                        const hni_code = res.result.hni_code
                        const hni_name = !res.result.hni_name ? '' : res.result.hni_name
                        const hni_header_text = !res.result.hni_header_text ? '' : res.result.hni_header_text
                        const hni_detail_text = !res.result.hni_detail_text ? '' : res.result.hni_detail_text
                        const hni_link_text = !res.result.hni_link_text ? '' : res.result.hni_link_text
                        const hni_data = !res.result.hni_data ? '' : JSON.stringify(res.result.hni_data)
                        const hni_remark = !res.result.hni_remark ? '' : res.result.hni_remark
                        const hni_start_datetime = res.result.hni_start_datetime
                        const hni_end_datetime = res.result.hni_end_datetime
                        const company_name = res.result.company_name
                        setHni_id(hni_id)
                        setRef_hni_id(ref_hni_id)
                        setHni_code(hni_code)
                        setAnnounceName(hni_name)
                        setAnnounceHead(hni_header_text)
                        setAnnounceDetail(hni_detail_text)
                        setAnnounceLink(hni_link_text)
                        setHni_data(hni_data)
                        setAnnounceRemark(hni_remark)
                        setDateTimeStart(moment(hni_start_datetime).format("YYYY-MM-DDTHH:mm"))
                        setDateTimeEnd(moment(hni_end_datetime).format("YYYY-MM-DDTHH:mm"))
                        setCompany_name(company_name)
                        const img_path = res.result.hni_data.image_hni ? res.result.hni_data.image_hni : null;
                        setImageHni(img_path)
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
                } else swal("Warning!", res.error, "warning");
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
    }, [])

    //-------------Close modal
    function closeModal(event) {
        setShowEdit(false);
    }
    //--------------Edit Annouce
    function editAnnouce(event) {
        const middleware = editAnnouceMiddleware();
        if (middleware)
            swal("Warning!", middleware, "warning");
        else {
            const announceObj = {
                hni_name: announceName
                , hni_id
                , ref_hni_id
                , hni_start_datetime: moment(dateTimeStart).format("YYYY-MM-DDTHH:mm:ss").toString()
                , hni_end_datetime: moment(dateTimeEnd).format("YYYY-MM-DDTHH:mm:ss").toString()
                , hni_header_text: announceHead
                , hni_detail_text: announceDetail
                , hni_link_text: announceLink
                , hni_remark: announceRemark
                , hni_data
                , image
            }
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            editAnnouceModal({ authStore, announceObj })
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
                        setShowLoading(false);
                    } else {
                        swal({
                            title: "Success.",
                            text: "เพิ่มประกาศเรียบร้อย",
                            icon: "success",
                            button: "OK",
                        });
                        setRefeshForm(true)
                        closeModal();
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

    function editAnnouceMiddleware() {
        if (dateTimeStart >= dateTimeEnd)
            return 'ช่วงเวลาประกาศจำต้องไม่เท่ากัน'
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
            show={showEdit}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขประกาศ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <InputDisable
                        title="ชื่อโครงการ"
                        text={company_name}
                    />
                    <InputDisable
                        title="Code"
                        text={hni_code}
                    />
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
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพแนบประกาศ"
                                link={imageHni}
                            />
                        </CCol>
                    </CRow>
                    <br></br>
                    <CRow>
                        <CCol xs="12" md="12">
                            <CLabel>เลือกรูปภาพใหม่</CLabel>
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
                <CButton className="btn-modal-footer" color="primary" onClick={editAnnouce}>แก้ไขประกาศ</CButton>
                <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AnnouceEditModal;