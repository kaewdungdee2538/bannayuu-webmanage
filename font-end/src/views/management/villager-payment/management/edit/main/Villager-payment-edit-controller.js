import axios from 'axios';
import ApiRoute from '../../../../../../apiroute'
export const getVillagerPaymentNotApproveByID = (props) => {
    const { authStore, selectVillagerPayment } = props;
    const company_id = authStore.company_id;
    const tpcfi_id = selectVillagerPayment.tpcfi_id; 
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        tpcfi_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_payment.get_villager_payment_by_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}