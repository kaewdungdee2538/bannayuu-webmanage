import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const addVillager = ({authStore,villagerObj}) => {
  const company_id = authStore.company_id;
  const home_id = authStore.home_selected.home_id;
  const config = {
    headers: { Authorization: `Bearer ${authStore.access_token}` },
  };
  const bodyParameters = {
    company_id,
    home_id,
    home_line_first_name:villagerObj.villager_f_name,
    home_line_last_name:villagerObj.villager_l_name,
    home_line_mobile_phone:villagerObj.villager_mobile_phone,
    home_line_remark:villagerObj.villager_remark
  };
  const url =`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.add_villager_url}`
  return axios.post(url,bodyParameters,config)
    .then((res) => {
      return res.data.response;
    }).catch(err=>{
        console.log(err)
    });
};
