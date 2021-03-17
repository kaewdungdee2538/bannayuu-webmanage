import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const addParcelReceive = (props) => {
    var bodyFormData = new FormData();
    const { authStore,  valuesObj} = props;
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
    };
    bodyFormData.append('company_id', company_id);
    bodyFormData.append('tpi_title', valuesObj.header);
    bodyFormData.append('tpi_detail', valuesObj.detail);
    bodyFormData.append('receive_parcel_detail', valuesObj.detail);
    bodyFormData.append('home_address', valuesObj.address);
    bodyFormData.append('image_parcel_receive', valuesObj.image);
    return axios
        .post(
            `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_parcel_receive_url}`,
            bodyFormData,
            config
        )
        .then((res) => {
            return res.data.response;
        });
};