import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const addAnnouceModal = (props) => {
    const {authStore,announceObj} = props
    const company_id = authStore.company_id;
    const hni_name = announceObj.hni_name
    const ref_hni_id = announceObj.ref_hni_id
    const hni_start_datetime = announceObj.hni_start_datetime
    const hni_end_datetime = announceObj.hni_end_datetime
    const hni_header_text = announceObj.hni_header_text
    const hni_detail_text = announceObj.hni_detail_text
    const hni_link_text = announceObj.hni_link_text
    const hni_data = announceObj.hni_data
    const hni_remark = announceObj.hni_remark
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,hni_name
        ,ref_hni_id
        ,hni_start_datetime
        ,hni_end_datetime
        ,hni_header_text
        ,hni_detail_text
        ,hni_link_text
        ,hni_data
        ,hni_remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.add_announce_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default addAnnouceModal;