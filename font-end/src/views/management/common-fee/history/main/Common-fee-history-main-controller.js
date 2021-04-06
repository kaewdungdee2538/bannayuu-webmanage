import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const getCommonFeeHistory = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.home_address;
    const start_date = searchObj.start_date;
    const end_date = searchObj.end_date;
    const search_type = searchObj.search_type;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_address,
        start_date,
        end_date,
        search_type,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.commonfee.get_common_fee_history_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}