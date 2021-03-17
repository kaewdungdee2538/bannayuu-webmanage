import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const EstampGetAllController = (props)=>{
    const { authStore ,selectedObj} = props;
    const company_id = authStore.company_id;
    const start_date = selectedObj.start_date;
    const end_date = selectedObj.end_date;
    const license_plate = selectedObj.license_plate
    const f_name = selectedObj.f_name
    const l_name = selectedObj.l_name
    const home_id = selectedObj.home_id
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        start_date,
        end_date,
        license_plate,f_name,l_name
        ,home_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.estamp.get_estamp_visitor_all}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default EstampGetAllController;