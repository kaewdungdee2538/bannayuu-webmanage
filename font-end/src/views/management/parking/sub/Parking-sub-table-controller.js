import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getParkingSubAllByCPHID = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const cph_id = searchObj.cph_id ? searchObj.cph_id : null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cph_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_sub_all_by_cph_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}