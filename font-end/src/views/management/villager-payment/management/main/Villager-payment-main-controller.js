import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const getVillagerPaymentNotApprove = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.home_address;
    const payment_event_id = searchObj.payment_event_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_address,
        payment_event_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_payment.get_villager_payment_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}