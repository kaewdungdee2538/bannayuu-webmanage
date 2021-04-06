import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const getHomeAllNotDisable = (props)=>{
    const { authStore,searchObj} = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.home_address ? searchObj.home_address : '';
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_address,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_allhome_not_disable_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const changeHome = (props)=>{
    const {authStore,selectedObj} = props;
    const company_id = authStore.company_id;
    const home_id = selectedObj.home_id;
    const home_line_id = selectedObj.home_line_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_id,
        home_line_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.save_change_home_villager_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}