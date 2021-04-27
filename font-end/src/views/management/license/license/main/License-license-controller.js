import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const getLicenseByHomeId = (props) => {
    const { authStore,searchObj } = props;
    const company_id = authStore.company_id;
    const home_id = searchObj.home_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.license.get_license_by_home_id_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};

