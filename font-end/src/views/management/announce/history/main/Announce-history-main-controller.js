import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const AnnounceHistoryMainController = (props)=>{
    const { authStore ,selected} = props;
    const company_id = authStore.company_id;
    const _value = selected.value;
    const _type = selected.type;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        _value,
        _type,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.get_history_announce_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default AnnounceHistoryMainController;