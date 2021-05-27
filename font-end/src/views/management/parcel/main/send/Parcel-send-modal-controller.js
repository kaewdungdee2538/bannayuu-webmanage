import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const getParcelWaitSendBydID = (props) =>{
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
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.get_parcel_wait_send_by_id_url}`;

    return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}


export const sendParcelSend = (props) => {
    var bodyFormData = new FormData();
    const { authStore,  valuesObj} = props;
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
    };
    bodyFormData.append('company_id', company_id);
    bodyFormData.append('tpi_id', valuesObj.tpi_id);
    bodyFormData.append('image', valuesObj.image);
    bodyFormData.append('send_parcel_detail', valuesObj.send_parcel_detail);
    
    return axios
        .post(
            `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_parcel_send_url}`,
            bodyFormData,
            config
        )
        .then((res) => {
            return res.data.response;
        });
};

export const sendParcelReject = (props) => {
  var bodyFormData = new FormData();
  const { authStore,  valuesObj} = props;
  const company_id = authStore.company_id;
  const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
  };
  bodyFormData.append('company_id', company_id);
  bodyFormData.append('tpi_id', valuesObj.tpi_id);
  bodyFormData.append('image_parcel_send', valuesObj.image);
  bodyFormData.append('send_parcel_detail', valuesObj.send_parcel_detail);
  
  return axios
      .post(
          `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_parcel_reject_url}`,
          bodyFormData,
          config
      )
      .then((res) => {
          return res.data.response;
      });
};
