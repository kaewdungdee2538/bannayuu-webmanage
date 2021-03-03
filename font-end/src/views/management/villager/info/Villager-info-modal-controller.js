import axios from "axios";
import ApiRoute from "../../../../apiroute";

export const getVillagerByIDInfo = (props) => {
    const {villagerObj,authStore} = props
    const company_id = authStore.company_id;
    const home_id = villagerObj.home_id;
    const home_line_id = villagerObj.home_line_id
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
      home_id,
      home_line_id,
    };
    const url =`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.get_vilager_byhomelineid_url}`
    return axios.post(url,bodyParameters,config)
      .then((res) => {
        return res.data.response;
      }).catch(err=>{
          console.log(err)
      });
  };

  
export const editVillager = (props) =>{
    const {authStore,villagerObj} = props;
    const company_id = authStore.company_id;
    const home_id = villagerObj.home_id;
    const home_line_id = villagerObj.home_line_id
    const home_line_first_name = villagerObj.home_line_first_name
    const home_line_last_name = villagerObj.home_line_last_name
    const home_line_mobile_phone = villagerObj.home_line_mobile_phone
    const home_line_remark = villagerObj.home_line_remark
    const home_enable = villagerObj.home_enable
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
      home_id,
      home_line_id,
      home_line_first_name,
      home_line_last_name,
      home_line_mobile_phone,
      home_line_remark,
      home_enable,
    };
    const url =`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager.edit_villager_url}`
    return axios.post(url,bodyParameters,config)
      .then((res) => {
        return res.data.response;
      }).catch(err=>{
          console.log(err)
      });
  }
  