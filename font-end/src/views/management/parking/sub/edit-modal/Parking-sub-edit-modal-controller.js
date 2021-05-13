import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const getParkingSubInfoByCPSID = (props) => {
    const { authStore, searchObj } = props;
    const company_id = authStore.company_id;
    const cps_id = searchObj.cps_id ? searchObj.cps_id : null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cps_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_sub_info_by_cps_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const editParkingSubInfo = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const cph_id = valuesObj.cph_id ? valuesObj.cph_id : null;
    const cps_id = valuesObj.cps_id ? valuesObj.cps_id : null;
    const start_interval = valuesObj.start_interval  ? valuesObj.start_interval  :null;
    const stop_interval = valuesObj.stop_interval  ? valuesObj.stop_interval  :null;
    const amount_value = valuesObj.amount_value  ? valuesObj.amount_value  :null;
    const remark = valuesObj.remark  ? valuesObj.remark  :null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cph_id,cps_id,
        start_interval,stop_interval,
        amount_value,remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.edit_parking_sub_info_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const disableParkingSubInfo = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const cps_id = valuesObj.cps_id ? valuesObj.cps_id : null;
    const remark = valuesObj.remark  ? valuesObj.remark  :null;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cps_id,remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.disable_parking_sub_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}