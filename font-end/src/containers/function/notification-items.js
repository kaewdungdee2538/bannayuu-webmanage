import axios from "axios";
import ApiRoute from "../../apiroute";

export const NotificationItemsAll = (props) => {
    const { authStore } = props;
    const company_id = authStore.company_id;
   
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.notification_item.get_notification_item_all_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
