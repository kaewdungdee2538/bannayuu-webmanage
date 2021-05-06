import axios from 'axios';
import ApiRoute from '../../../../../apiroute'

export const addParkingSubConfig = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
   const cph_id = valuesObj.cph_id;
   const start_interval = valuesObj.start_interval;
   const stop_interval = valuesObj.stop_interval;
   const amount_value = valuesObj.amount_value;
    const url_path = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.create_parking_sub_url}`
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cph_id,
        start_interval,
        stop_interval,
        amount_value
    }
    return axios.post(url_path
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}