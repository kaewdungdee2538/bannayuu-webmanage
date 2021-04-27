import axios from 'axios';
import ApiRoute from '../apiroute'
export const getPaymentEventArray = ({authStore}) => {
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    return axios
      .get(
        `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.payment_event.get_payment_event_all_url}`,
        config
      )
      .then((res) => {
        return res.data.response;
      })
      .catch(err=>{
          console.log(err)
      });
  };

  export const getWorkflowPaymentArray = ({authStore}) => {
    const config = {
      headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    return axios
      .get(
        `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.payment_event.get_payment_workflow_all_url}`,
        config
      )
      .then((res) => {
        return res.data.response;
      })
      .catch(err=>{
          console.log(err)
      });
  }