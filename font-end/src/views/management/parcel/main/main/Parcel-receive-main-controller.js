import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const ParcelReceiveMainController = (props) => {
    const { authStore,searchObj } = props;
    const company_id = authStore.company_id;
    const home_address = searchObj.address;
    const head_text = searchObj.headerText;
    const start_date = searchObj.start_date;
    const end_date = searchObj.end_date;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        home_address,
        head_text,
        start_date,
        end_date,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parcel.get_parcel_wait_send_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};

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