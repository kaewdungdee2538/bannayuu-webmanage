import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const addLicenseByHomeId = (props) => {
    const { authStore,valuesObj } = props;
    const company_id = authStore.company_id;
    const home_id = valuesObj.home_id;
    const license_plate = valuesObj.license_plate;
    const car_brand = valuesObj.car_brand;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_id,
        license_plate,
        car_brand,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.license.add_license_by_home_id_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};