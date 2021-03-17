import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const ParcelHistoryMainController = (props) => {
    const { authStore,searchObj } = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.address;
    const head_text = searchObj.headerText;
    const start_date = searchObj.start_date;
    const end_date = searchObj.end_date;
    const status_type = searchObj.status_type;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_address,
        head_text,
        start_date,
        end_date,
        status_type,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.get_parcel_history_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
