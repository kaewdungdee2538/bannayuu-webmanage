import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const SosHistoryController = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const start_date = searchObj.start_date;
    const end_date = searchObj.end_date;
    const home_address = searchObj.address;
    const status_type = searchObj.status_type;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        start_date,
        end_date,
        home_address,
        status_type,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.sos.get_sos_info_all_history_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
