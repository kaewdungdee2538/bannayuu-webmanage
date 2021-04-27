import axios from "axios";
import ApiRoute from "../../../../../../apiroute";

export const getLicenseByCarId = (props) => {
    const { authStore,setSelectedObj } = props;
    const company_id = authStore.company_id;
    const home_car_id = setSelectedObj.home_car_id;
   
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_car_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.license.get_license_by_home_car_id_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};