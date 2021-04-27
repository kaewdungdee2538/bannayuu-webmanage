import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
const CommonFeeManagementMainController = (props)=>{
    const { authStore,searchObj } = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.home_address;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        home_address,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.villager_cost.get_villager_cost_not_pay_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export default CommonFeeManagementMainController;

export const getHomeNotDisableInfo = ({authStore}) => {
    const company_id = authStore.company_id;
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
    };
    return axios
      .post(
        `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_alladdress_not_disable_url}`,
        bodyParameters,
        config
      )
      .then((res) => {
        return res.data.response;
      });
  };