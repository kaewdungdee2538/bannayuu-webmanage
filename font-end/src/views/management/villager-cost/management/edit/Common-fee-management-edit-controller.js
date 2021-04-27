import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const CommonFeeManagementEditController = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const home_id = valuesObj.home_id;
    const date_from = valuesObj.dateFrom;
    const date_to = valuesObj.dateTo;
    const square_value = valuesObj.squareValue;
    const payment_amount = valuesObj.paymentAmount;
    const remark = valuesObj.remark;
    const scfi_id = valuesObj.scfi_id
    const payment_event_id = valuesObj.payment_event_id;
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
        remark,
        scfi_id,
        payment_event_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.edit_villager_cost_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const CommonFeeManagementGetById = (props) =>{
    const { authStore, selectCommon } = props;
    const company_id = authStore.company_id;
    const scfi_id = selectCommon.scfi_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        scfi_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.get_villager_cost_get_by_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const saveCancelCommonFee = (props) =>{
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const scfi_id = valuesObj.scfi_id;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        scfi_id,
        remark,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.cancel_villager_cost_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

