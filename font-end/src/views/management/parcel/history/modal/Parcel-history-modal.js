import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parcel-history-modal.css'
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
import CIcon from '@coreui/icons-react'
import InputDisable from '../../../component/input/InputDisable'
import TextArea from '../../../component/textarea/TextArea'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import { getParcelHistoryBydID } from './Parcel-history-modal-controller'
import ImageBox from '../../../component/image/ImageBox'
import ApiRoute from '../../../../../apiroute'
const ParcelHistoryModal = ({ showModal, setShowModal, selectedObj }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const [parcelObj, setParcelObj] = useState({
        tpi_id: "", tpi_code: "", home_address: ""
        , tpi_title: "", tpi_detail: "", receive_parcel_datetime: ""
        , receive_parcel_by: "", receive_parcel_detail: ""
        , image_parcel_receive: "", tpi_status: "", company_name: ""
        , send_parcel_datetime: "", send_parcel_by: "", send_parcel_detail: ""
        , image_parcel_send: "", receive_vilager_datetime: "", receive_vilager_by: ""
        , receive_vilager_detail: ""
    })
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('Choose File');
    const [remark, setRemark] = useState('')
    const [imageReceive, setImageReceive] = useState(null)
    const [imageSend, setImageSend] = useState(null)

    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            document.body.style.cursor = "wait";
            getParcelHistoryBydID({ authStore, selectedObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setParcelObj(result);
                        setImageReceive(result.image_parcel_receive)
                        setImageSend(result.image_parcel_send)
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page404");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                });
        }
    }, [])
    //--------------------------Close Modal
    function closeModal(event) {
        setShowModal(false);
    }


    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-parcel-his">
                <CModalTitle>ประวัติการรับ-ส่งพัสดุให้ลูกบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="ชื่อโครงการ"
                                text={parcelObj.company_name}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="รหัสรับพัสดุ"
                                text={parcelObj.tpi_code}
                            />
                        </CCol>
                        <CCol xs="12" sm="6" md="6">
                            <InputDisable
                                title="บ้านเลขที่ (ลูกบ้าน)"
                                text={parcelObj.home_address}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <InputDisable
                                title="หัวข้อการรับพัสดุ"
                                text={parcelObj.tpi_title}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดของพัสดุ"
                                rows="3"
                                text={parcelObj.receive_parcel_detail}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่รับพัสดุ"
                                text={parcelObj.receive_parcel_datetime}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้รับพัสดุ"
                                text={parcelObj.receive_parcel_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพพัสดุ"
                                link={imageReceive}
                            />
                        </CCol>
                    </CRow>
                    <hr></hr>
                    <CRow>
                        <CCol xs="12" sm="5" md="5">
                            <InputDisable
                                title="วันที่ส่งมอบพัสดุ"
                                text={parcelObj.send_parcel_datetime}
                            />
                        </CCol>
                        <CCol xs="12" sm="7" md="7">
                            <InputDisable
                                title="ผู้ส่งมอบพัสดุ"
                                text={parcelObj.send_parcel_by}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12">
                            <TextAreaDisable
                                title="รายละเอียดการส่งมอบพัสดุ"
                                rows="3"
                                text={parcelObj.send_parcel_detail}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <ImageBox
                                title="รูปภาพการส่งมอบพัสดุ"
                                link={imageSend}
                            />
                        </CCol>
                    </CRow>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <div></div>
                <div>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    )
}

export default ParcelHistoryModal