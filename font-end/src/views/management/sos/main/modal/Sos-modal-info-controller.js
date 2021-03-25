import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const getSosInfoBydID = (props) => {
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


export const sendCorporateReceive = (props) => {
  const { valuesObj, authStore } = props;
  const company_id = authStore.company_id;
  const sos_id = valuesObj.sos_id;
  const sos_remark = valuesObj.sos_remark;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    sos_id,
    sos_remark,
  };
  const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.sos.save_sos_corporate_receive_url}`;

  return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
};

export const sendCorporateReject = (props) => {
  const { valuesObj, authStore } = props;
  const company_id = authStore.company_id;
  const sos_id = valuesObj.sos_id;
  const sos_remark = valuesObj.sos_remark;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    sos_id,
    sos_remark,
  };
  const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.sos.save_sos_corporate_reject_url}`;

  return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}
// export const sendCorporateReceive = (props) => {
//   var bodyFormData = new FormData();
//   const { authStore,  valuesObj} = props;
//   const company_id = authStore.company_id;
//   const config = {
//       headers: { Authorization: `Bearer ${authStore.access_token}`, "Content-Type": "multipart/form-data" },
//   };
//   bodyFormData.append('company_id', company_id);
//   bodyFormData.append('tpi_id', valuesObj.tpi_id);
//   bodyFormData.append('image_parcel_send', valuesObj.image);
//   bodyFormData.append('send_parcel_detail', valuesObj.send_parcel_detail);

//   return axios
//       .post(
//           `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.save_parcel_send_url}`,
//           bodyFormData,
//           config
//       )
//       .then((res) => {
//           return res.data.response;
//       });
// };