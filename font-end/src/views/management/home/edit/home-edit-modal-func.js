import axios from "axios";
import ApiRoute from "../../../../apiroute";

const getHomeInfo = (authStore) => {
  const company_id = authStore.company_id;

  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
  };
  return axios
    .post(
      `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_allhome_url}`,
      bodyParameters,
      config
    )
    .then((res) => {
      return res.data.response;
    });
};

export default getHomeInfo;

export const getHomeInfoByID = (props) => {
  const { home_id, authStore } = props;
  const company_id = authStore.company_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id,
  };
  const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_home_byid_url}`;
  return axios
    .post(url, bodyParameters, config)
    .then((res) => {
      return res.data.response;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally();
};

export const editHomeInfoByID = (props) => {
  const { home_obj, authStore } = props;
  const company_id = authStore.company_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id: home_obj.home_id,
    home_address: home_obj.home_address,
    home_remark: home_obj.home_remark,
    home_enable:home_obj.home_enable
  };
  const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.edit_homeinfo_url}`;
  return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
};

export const deleteHomeByID = (props) => {
  const { homeObj, authStore } = props;
  const company_id = authStore.company_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id: homeObj.home_id,
  };
  const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.delete_homeinfo_url}`;
  return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
};
