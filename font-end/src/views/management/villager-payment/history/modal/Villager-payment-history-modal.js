import './Villager-payment-history-modal.css'
import { useEffect, useState } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import swal from 'sweetalert';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../../store'
import PropTypes from 'prop-types';
import { getVillagerPaymentHistoryByID } from './Villager-payment-history-modal-controller'
import ApiRoute from '../../../../../apiroute'
import VillagerPaymentHistoryTransferType from './transfer-type/Villager-payment-history-transfer-type'
import VillagerPaymentHistoryCreditType from './credit-type/Villager-payment-history-credit-type'
function VillagerPaymentHistoryModal(props) {
    const {
        selectVillagerPayment,
        setShowModal,
        showModal,
        setShowLoading,
    } = props;
    const history = useHistory();
    const authStore = useSelector(state => state)
    //--------------------------State
    const [imageBill, setImageBill] = useState(null)
    const [villagerPaymentObj, setVillagerPaymentObj] = useState({
        tpcfi_id: "", tpcfi_code: "", scfi_code: ""
        , head_tpcfi_id: "", ref_tpcfi_id: "", payment_type_id: ""
        , payment_event_id: "", payment_event_name: ""
        , workflow_id: "", workflow_name: ""
        , payment_amount: "", status: "", home_address: ""
        , home_line_id: "", home_line_first_name: "", home_line_last_name: ""
        , create_date: ""
        , m_bank: "", credit_bank: "", credit_city: "", credit_name: ""
        , credit_brand: "", credit_financing: "", credit_funding_amount: ""
    })
    const [showTransfer, setShowTransfer] = useState(false);
    const [showCredit, setShowCredit] = useState(false);

    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            getVillagerPaymentHistoryByID({ authStore, selectVillagerPayment })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        const url_img_json = JSON.parse(result.img_bill);
                        setVillagerPaymentObj(result);
                        if (result.check_by) {
                            const img_bill_url = ApiRoute.image_payment_url + url_img_json
                            setImageBill(img_bill_url);
                            //-------------Set show transfer form
                            setShowTransfer(true)
                        } else {
                            //-------------Set show credit form
                            setShowCredit(true)
                        }

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
    //--------------------------------------
    let transferElem = null;
    if (showTransfer) {
        transferElem = <VillagerPaymentHistoryTransferType
            villagerPaymentObj={villagerPaymentObj}
            imageBill={imageBill}
            closeModal={closeModal}
        />
    } else transferElem = null;
    let creditElem = null;
    if (showCredit) {
        creditElem = <VillagerPaymentHistoryCreditType
            villagerPaymentObj={villagerPaymentObj}
            imageBill={imageBill}
            closeModal={closeModal}
        />
    } else creditElem = null;
    //--------------------------Close Modal
    function closeModal(event) {
        setShowModal(false);
    }

    //----------------------------------------------
    return (
        <CModal
            show={showModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-villager-payment-history">
                <CModalTitle>ประวัติการชำระเงินของลูกบ้าน</CModalTitle>
            </CModalHeader>
            {transferElem}
            {creditElem}
        </CModal>
    );
}
VillagerPaymentHistoryModal.propTypes = {
    selectVillagerPayment: PropTypes.any.isRequired,
    setShowModal: PropTypes.func.isRequired,
}
export default VillagerPaymentHistoryModal;
