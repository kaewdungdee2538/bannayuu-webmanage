import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getCardByID = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const card_id = valuesObj.card_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,card_id
       
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.card.get_card_info_by_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const editCardRFID = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const card_id = valuesObj.card_id;
    const card_name = valuesObj.card_name;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,card_id
        ,card_name
        ,remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.card.edit_card_rfid_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const disableCardRFID = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const card_id = valuesObj.card_id;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,card_id
        ,remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.card.disable_card_rfid_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}
