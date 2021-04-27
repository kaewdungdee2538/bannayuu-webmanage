import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const CommonFeeManagementAddController = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const home_id = valuesObj.home_id;
    const date_from = valuesObj.dateFrom;
    const date_to = valuesObj.dateTo;
    const square_value = valuesObj.squareValue;
    const payment_amount = valuesObj.paymentAmount;
    const payment_event_id = valuesObj.payment_event_id;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_id,
        date_from,
        date_to,
        square_value,
        payment_amount,
        payment_event_id,
        remark,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.add_villager_cost_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default CommonFeeManagementAddController;