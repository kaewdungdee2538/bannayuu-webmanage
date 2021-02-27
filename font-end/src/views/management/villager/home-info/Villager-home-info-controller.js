import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const getHomeInfo = (authStore) => {
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