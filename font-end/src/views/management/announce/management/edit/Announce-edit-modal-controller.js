import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const getAnnouceByIdModal = (props) => {
    const {authStore,announceObj} = props
    const company_id = authStore.company_id;
    const hni_id = announceObj.hni_id
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id
        ,hni_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.get_announce_byid_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const editAnnouceModal = (props) => {
    const {authStore,announceObj} = props
    const company_id = authStore.company_id;
    const hni_id = announceObj.hni_id
    const hni_name = announceObj.hni_name
    const ref_hni_id = announceObj.ref_hni_id
    const hni_start_datetime = announceObj.hni_start_datetime
    const hni_end_datetime = announceObj.hni_end_datetime
    const hni_header_text = announceObj.hni_header_text
    const hni_detail_text = announceObj.hni_detail_text
    const hni_link_text = announceObj.hni_link_text
    const hni_remark = announceObj.hni_remark
    const hni_data = announceObj.hni_data ? announceObj.hni_data : ''
    const image = announceObj.image ? announceObj.image : ''
    var bodyFormData = new FormData();
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
    };
    bodyFormData.append('company_id', company_id);
    bodyFormData.append('hni_name', hni_name);
    bodyFormData.append('hni_id', hni_id);
    bodyFormData.append('ref_hni_id', ref_hni_id);
    bodyFormData.append('hni_start_datetime', hni_start_datetime);
    bodyFormData.append('hni_end_datetime', hni_end_datetime);
    bodyFormData.append('hni_header_text', hni_header_text);
    bodyFormData.append('hni_detail_text', hni_detail_text);
    bodyFormData.append('hni_link_text', hni_link_text);
    bodyFormData.append('hni_data', hni_data);
    bodyFormData.append('hni_remark', hni_remark);
    bodyFormData.append('image_hni', image);
    return axios
        .post(
            `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.edit_announce_url}`,
            bodyFormData,
            config
        )
        .then((res) => {
            return res.data.response;
        });
}
