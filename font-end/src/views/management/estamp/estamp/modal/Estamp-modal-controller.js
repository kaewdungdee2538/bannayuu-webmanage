import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const EstampModalController = (props)=>{
    const { authStore ,selectedObj} = props;
    const company_id = authStore.company_id;
    const visitor_record_id = selectedObj.visitor_record_id;
    const visitor_record_code = selectedObj.visitor_record_code
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        visitor_record_id,
        visitor_record_code,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.estamp.get_visitor_record_byid}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const EstampModalEditController = (props)=>{
    const { authStore ,editEstampObj} = props;
    const company_id = authStore.company_id;
    const visitor_record_id = editEstampObj.visitor_record_id;
    const visitor_record_code = editEstampObj.visitor_record_code
    const estamp_flag = editEstampObj.estamp_flag ? 'Y' : 'N'

    console.log(editEstampObj)
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        visitor_record_id,
        visitor_record_code,
        estamp_flag,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.estamp.edit_visitor_estamp_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}