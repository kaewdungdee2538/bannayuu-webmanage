import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getParkingMasterById = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const cpm_id = searchObj.cpm_id ? searchObj.cpm_id : null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cpm_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_master_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}