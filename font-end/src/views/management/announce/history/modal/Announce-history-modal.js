import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Announce-history-modal.css'
import { useSelector } from 'react-redux'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
} from '@coreui/react'
import InputDisable from '../../../component/input/InputDisable'
import TextAreaDisable from '../../../component/textarea/TextAreaDisable'
import StatusItem from '../../../component/status-item/StatusItem'
import AnnounceHistoryModalController from './Announce-history-modal-controller'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../../store'


const AnnounceHistoryModal = ({ showHistory, setShowHistory, selectHistory, setShowLoading }) => {
    const history = useHistory();
    //-----------------------State
    const authStore = useSelector(state => state)
    const [itemsObj, setItemsObj] = useState({
        hni_code: ""
        , hni_name: "", hni_header_text: ""
        , hni_detail_text: "", hni_remark: ""
        , hni_link_text: ""
        , hni_start_datetime: ""
        , hni_end_datetime: ""
        , hni_status: ""
        , company_name: ""
    })
    //------------------------Load form 
    useEffect(() => {
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = 'wait';
        AnnounceHistoryModalController({ authStore, selectHistory })
            .then(res => {
                if (res.error) {
                    if (res.statusCode === 401) {
                        isNotAuth = res.error
                    } else swal({
                        title: "Waring.",
                        text: res.message,
                        icon: "warning",
                        button: "OK",
                    });
                } else {
                    const result = res.result;
                    setItemsObj({
                        hni_code: result.hni_code
                        , hni_name: result.hni_name
                        , hni_header_text: result.hni_header_text
                        , hni_detail_text: result.hni_detail_text
                        , hni_remark: result.hni_remark
                        , hni_link_text: result.hni_link_text
                        , hni_start_datetime: result.hni_start_datetime
                        , hni_end_datetime: result.hni_end_datetime
                        , hni_status: !result.status ? "none" : result.status
                        , company_name: result.company_name
                    })
                }
            }).catch(err => {
                console.log(err)
                history.push('/page500')
            }).finally(value => {
                document.body.style.cursor = 'default';
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            })
    }, [])
    //------------------------Close
    function closeModal(event) {
        setShowHistory(false);
    }

    return (
        <CModal
            show={showHistory}
            onClose={closeModal}
            closeOnBackdrop={false}
            size="lg"
        >
            <CModalHeader closeButton className="modal-header">
                <CModalTitle>ประวัติประกาศโครงการ</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <InputDisable
                        title="ชื่อโครงการ"
                        text={itemsObj.company_name}
                    />
                    <InputDisable
                        title="Code"
                        text={itemsObj.hni_code}
                    />
                    <InputDisable
                        title="ชื่อประกาศ"
                        text={itemsObj.hni_name}
                    />
                    <InputDisable
                        title="หัวข้อประกาศ"
                        text={itemsObj.hni_header_text}
                    />
                    <TextAreaDisable
                        title="รายละเอียดประกาศ"
                        text={itemsObj.hni_detail_text}
                        rows="6"
                    />
                    <InputDisable
                        title="หมายเหตุ"
                        text={itemsObj.hni_remark}
                    />
                    <InputDisable
                        title="ลิงค์อ้างอิง"
                        text={itemsObj.hni_link_text}
                    />
                    <InputDisable
                        title="เวลาเริ่มประกาศ"
                        text={itemsObj.hni_start_datetime}
                    />
                    <InputDisable
                        title="เวลาสิ้นสุดประกาศ"
                        text={itemsObj.hni_end_datetime}
                    />
                    <StatusItem
                        title="สถานะของประกาศ"
                        text={itemsObj.hni_status}
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div></div>
                <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AnnounceHistoryModal