import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
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

    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.get_villager_cost_get_by_id_history_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

