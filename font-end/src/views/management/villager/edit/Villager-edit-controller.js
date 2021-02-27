import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const getVillagerInfo = (authStore) => {
  const company_id = authStore.company_id;
  const home_id = authStore.home_selected.home_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id,
  };
  const url =`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.get_allvillager_byhomeid_url}`
  return axios.post(url,bodyParameters,config)
    .then((res) => {
      return res.data.response;
    }).catch(err=>{
        console.log(err)
    });
};
