import axios from "axios";
import ApiRoute from "../../../../../../apiroute";

export const saveLicenseEdit = (props) => {
    const { authStore,valuesObj } = props;
    const company_id = authStore.company_id;
    const home_car_id = valuesObj.home_car_id;
    const license_plate = valuesObj.license;
    const remark = valuesObj.remark;
    const car_status = valuesObj.car_status;
    const car_brand = valuesObj.car_brand;
   
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_car_id,
        license_plate,
        remark,
        car_status,
        car_brand,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.license.save_edit_license_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};