import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const addCardRFID = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const card_code = valuesObj.card_code;
    const card_name = valuesObj.card_name.toUpperCase();
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,card_code,card_name
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.card.add_card_rfid_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}
