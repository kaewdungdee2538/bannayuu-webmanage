import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const addAnnouceModal = (props) => {
    const {authStore,announceObj} = props
    var bodyFormData = new FormData();
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
    };
    bodyFormData.append('company_id', authStore.company_id);
    bodyFormData.append('hni_name', announceObj.hni_name);
    bodyFormData.append('ref_hni_id', announceObj.ref_hni_id);
    bodyFormData.append('hni_start_datetime', announceObj.hni_start_datetime);
    bodyFormData.append('hni_end_datetime', announceObj.hni_end_datetime);
    bodyFormData.append('hni_header_text', announceObj.hni_header_text);
    bodyFormData.append('hni_detail_text', announceObj.hni_detail_text);
    bodyFormData.append('hni_link_text', announceObj.hni_link_text);
    bodyFormData.append('hni_data', announceObj.hni_data);
    bodyFormData.append('hni_remark', announceObj.hni_remark);
    bodyFormData.append('image_hni', announceObj.image);
    return axios
        .post(
            `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.announce.add_announce_url}`,
            bodyFormData,
            config
        )
        .then((res) => {
            return res.data.response;
        });
}

export default addAnnouceModal;