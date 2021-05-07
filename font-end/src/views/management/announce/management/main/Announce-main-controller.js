import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const getAnnouceModal = (props) => {
    const { authStore } = props
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.get_announce_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default getAnnouceModal;