import axios from "axios";
import ApiRoute from "../../../../../../apiroute";

export const saveLicenseHomeChange = (props) => {
    const { authStore,valuesObj } = props;
    const company_id = authStore.company_id;
    const home_car_id = valuesObj.home_car_id;
    const home_id = valuesObj.home_id;
    const remark = valuesObj.remark;

    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_car_id,
        remark,
        home_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.license.save_edit_license_home_change_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};