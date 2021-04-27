import axios from 'axios';
import ApiRoute from '../../../../../../apiroute'
export const VillagerPaymentSendContactCorporate = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const tpcfi_id = valuesObj.tpcfi_id;
    const scfi_code = valuesObj.scfi_code;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        tpcfi_id,
        scfi_code,
        remark,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_payment.save_villager_payment_cancel_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}