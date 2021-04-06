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


export const changeHome = (props)=>{
    const {authStore,selectedObj} = props;
    const company_id = authStore.company_id;
    const home_id = selectedObj.home_id;
    const tpi_id = selectedObj.tpi_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_id,
        tpi_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_change_home_parcel_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const saveCancelSendParcel = (props) =>{
    const { valuesObj, authStore } = props;
    const company_id = authStore.company_id;
    const tpi_id = valuesObj.tpi_id;
    const tpi_remark = valuesObj.tpi_remark
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
      tpi_id,
      tpi_remark
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_cancel_send_parcel_url}`;

    return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}