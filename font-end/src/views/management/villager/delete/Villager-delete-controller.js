import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const deleteVillager = (props) => {
    const {authStore,villagerObj} = props;
  const company_id = authStore.company_id;
  const home_id = villagerObj.home_id;
  const home_line_id = villagerObj.home_line_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id,
    home_line_id,
  };
  config.data = bodyParameters;
  const url =`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.delete_villager_url}`
  return axios.delete(url,config)
    .then((res) => {
      return res.data.response;
    }).catch(err=>{
        console.log(err)
    });
};
