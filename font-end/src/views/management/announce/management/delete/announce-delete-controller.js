import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const cancelAnnouceModal = (props) => {
    const { authStore, announceObj } = props
    const company_id = authStore.company_id;
    const hni_id = announceObj.hni_id
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        hni_id
    }
    config.data = bodyParameters;
    return axios.delete(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.delete_announce_url}`
        , config
    ).then((res) => { return res.data.response })
}

export default cancelAnnouceModal;