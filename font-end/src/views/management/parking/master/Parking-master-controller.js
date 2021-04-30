import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getParkingMasterAll = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const cartype_id = searchObj.cartype_id ? searchObj.cartype_id : null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_master_all_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}