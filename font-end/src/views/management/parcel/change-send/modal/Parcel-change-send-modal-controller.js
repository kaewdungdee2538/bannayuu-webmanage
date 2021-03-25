import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const getParcelInfoBydID = (props) =>{
    const { selectedObj, authStore } = props;
    const company_id = authStore.company_id;
    const tpi_id = selectedObj.tpi_id;
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
      tpi_id
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.get_parcel_history_by_id_url}`;

    return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}
