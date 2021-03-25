import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const SosMainController = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const start_date = searchObj.start_date;
    const end_date = searchObj.end_date;
    const home_address = searchObj.address;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        start_date,
        end_date,
        home_address,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.sos.get_sos_info_all_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
