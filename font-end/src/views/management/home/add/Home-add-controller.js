import axios from 'axios';
import ApiRoute from '../../../../apiroute'
const addHomeInfo = (props) => {
    const {authStore} = props
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_address: props.home_address,
        home_remark: props.home_remark,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.add_homeinfo_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default addHomeInfo;
 