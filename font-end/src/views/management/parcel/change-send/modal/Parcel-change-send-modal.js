import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Parcel-change-send-modal.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    CModal,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import { getParcelInfoBydID } from './Parcel-change-send-modal-controller'
import store, { disAuthenticationLogin } from '../../../../../store'
import ParcelChangeSendModalFirst from './Parcel-change-send-modal-first'
import ParcelChangeSendModalHomeChange from './Parcel-change-send-modal-home-change'
const ParcelChangeSendModal = ({ showEditModal, setShowEditModal, selectedObj, setShowLoading, setRefeshForm }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------------------State
    const [parcelObj, setParcelObj] = useState({
        tpi_id: "", tpi_code: "", home_address: ""
        , tpi_title: "", tpi_detail: "", receive_parcel_datetime: ""
        , receive_parcel_by: "", receive_parcel_detail: ""
        , image_parcel_receive: "", tpi_status: "", company_name: ""
        , send_parcel_datetime: "", send_parcel_by: "", send_parcel_detail: ""
        , image_parcel_send: "", receive_vilager_datetime: "", receive_vilager_by: ""
        , receive_vilager_detail: ""
    })
    const [imageReceive, setImageReceive] = useState(null)
    const [imageSend, setImageSend] = useState(null)
    const [showFirstModal,setShowFirstModal] = useState(false);
    const [showHomeChangeModal,setShowHomeChangeModal] = useState(false);
    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            getParcelInfoBydID({ authStore, selectedObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setParcelObj(result);
                        setImageReceive(result.image_parcel_receive)
                        setImageSend(result.image_parcel_send)
                        setShowFirstModal(true);
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error;
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
        }
    }, [])
    //--------------------------Close Modal
    function closeModal(event) {
        setShowEditModal(false);
        setRefeshForm(true);
    }
    //--------------------------if show first modal
    let parcelModalFirst = null;
    if(showFirstModal){
        parcelModalFirst = <ParcelChangeSendModalFirst
        parcelObj={parcelObj}
        closeModal={closeModal}
        imageReceive={imageReceive}
        imageSend={imageSend}
        setShowFirstModal={setShowFirstModal}
        setShowHomeChangeModal={setShowHomeChangeModal}
        setShowLoading={setShowLoading}
        setRefeshForm={setRefeshForm}
        />
    }else parcelModalFirst = null;
    //------------------------if show home change
    let parcelModalHomeChange = null;
    if(showHomeChangeModal){
        parcelModalHomeChange = <ParcelChangeSendModalHomeChange
        closeModal={closeModal}
        parcelObj={parcelObj}
        setShowLoading={setShowLoading}
        setShowFirstModal={setShowFirstModal}
        setShowHomeChangeModal={setShowHomeChangeModal}
        setShowLoading={setShowLoading}
        setRefeshForm={setRefeshForm}
        />
    }else parcelModalHomeChange = null;
    //--------------------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-parcel-change">
                <CModalTitle>แก้ไขการส่งพัสดุให้ลูกบ้าน</CModalTitle>
            </CModalHeader>
            {parcelModalFirst}
            {parcelModalHomeChange}
        </CModal>
    )
}

export default ParcelChangeSendModal