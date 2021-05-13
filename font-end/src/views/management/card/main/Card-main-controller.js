import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getCardAll = (props) => {
    const { authStore,searchObj } = props
    const company_id = authStore.company_id;
    const card_code = searchObj.card_code;
    const card_name = searchObj.card_name;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id    
        ,card_code,card_name
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.card.get_card_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}