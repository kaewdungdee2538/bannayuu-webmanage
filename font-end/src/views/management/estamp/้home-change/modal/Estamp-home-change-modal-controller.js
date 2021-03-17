import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const EstampHomeChangeModalController = (props)=>{
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