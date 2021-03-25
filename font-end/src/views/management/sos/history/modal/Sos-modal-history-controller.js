import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const getSosInfoBydID = (props) =>{
    const { selectedObj, authStore } = props;
    const company_id = authStore.company_id;
    const sos_id = selectedObj.sos_id;
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
      sos_id
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.sos.get_sos_info_by_id_url}`;
    
    return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}
