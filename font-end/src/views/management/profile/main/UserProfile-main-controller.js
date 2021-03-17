import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const GetUserProfileByIDController = (props) => {
    const { authStore } = props;
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.user_profile.get_user_profile_by_id_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
