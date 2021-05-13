import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const AnnounceHistoryMainController = (props)=>{
    const { authStore ,valuesObj} = props;
    const company_id = authStore.company_id;
    const start_date = valuesObj.start_date;
    const stop_date = valuesObj.stop_date;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        start_date,
        stop_date,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.get_history_announce_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default AnnounceHistoryMainController;