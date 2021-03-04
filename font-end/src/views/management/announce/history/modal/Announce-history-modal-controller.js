import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const AnnounceHistoryModalController = (props)=>{
    const { authStore ,selectHistory} = props;
    const company_id = authStore.company_id;
    const hni_id = selectHistory.hni_id;
    const hni_code = selectHistory.hni_code;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        hni_id,
        hni_code,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.get_history_announce_by_hni_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default AnnounceHistoryModalController;