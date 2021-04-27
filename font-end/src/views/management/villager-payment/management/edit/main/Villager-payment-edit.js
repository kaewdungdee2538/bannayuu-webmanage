import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './Villager-payment-edit.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    CModal,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import store, { disAuthenticationLogin } from '../../../../../../store'
import { getVillagerPaymentNotApproveByID } from './Villager-payment-edit-controller'
import ApiRoute from '../../../../../../apiroute'
import VillagerPaymentEditInfo from '../info/Villager-payment-edit-info'
import VillagerPaymentEditApprove from '../approve/Villager-payment-edit-approve'
import VillagerPaymentEditCancel from '../cancel/Villager-payment-edit-cancel'
const VillagerPaymentEdit = ({ showModal, setShowModal, selectVillagerPayment, setShowLoading,setRefeshForm }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const [villagerPaymentObj, setVillagerPaymentObj] = useState({
        tpcfi_id: "", tpcfi_code: "", scfi_code: ""
        , head_tpcfi_id: "", ref_tpcfi_id: "", payment_type_id: ""
        , payment_event_id: "", payment_event_name: ""
        , workflow_id: "", workflow_name: ""
        , payment_amount: "", status: "", home_address: ""
        , home_line_id: "", home_line_first_name: "", home_line_last_name: ""
        , create_date: ""
    })
    const [imageBill, setImageBull] = useState(null)
    const [showInfo, setShowInfo] = useState(true);
    const [showCancel, setShowCancel] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            getVillagerPaymentNotApproveByID({ authStore, selectVillagerPayment })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        const url_img_json = JSON.parse(result.img_bill);
                        setVillagerPaymentObj(result);
                        const img_bill_url = ApiRoute.image_payment_url + url_img_json
                        setImageBull(img_bill_url);
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
        setShowModal(false);
    }
    //--------------------------Info Form
    let infoElem = null;
    if (showInfo) {
        infoElem = <VillagerPaymentEditInfo
            villagerPaymentObj={villagerPaymentObj}
            imageBill={imageBill}
            closeModal={closeModal}
            setShowInfo={setShowInfo}
            setShowCancel={setShowCancel}
            setShowApprove={setShowApprove}
        />
    }
    //------------------------Approve Form
    let approveElem = null;
    if (showApprove) {
        approveElem = <VillagerPaymentEditApprove
            villagerPaymentObj={villagerPaymentObj}
            closeModal={closeModal}
            setShowInfo={setShowInfo}
            setShowCancel={setShowCancel}
            setShowApprove={setShowApprove}
            setShowLoading={setShowLoading}
            setRefeshForm={setRefeshForm}
        />
    }
    //----------------------Cancel Form
    let cancelElem = null;
    if (showCancel) {
        cancelElem = <VillagerPaymentEditCancel
            villagerPaymentObj={villagerPaymentObj}
            closeModal={closeModal}
            setShowInfo={setShowInfo}
            setShowCancel={setShowApprove}
            setShowApprove={setShowApprove}
            setShowLoading={setShowLoading}
            setRefeshForm={setRefeshForm}
        />
    }

    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-villager-payment">
                <CModalTitle>ตรวจสอบการชำระเงินของลูกบ้าน (โดยการโอนเงิน)</CModalTitle>
            </CModalHeader>
            {infoElem}
            {approveElem}
            {cancelElem}
        </CModal>
    )
}

export default VillagerPaymentEdit;