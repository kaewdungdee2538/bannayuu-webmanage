import axios from 'axios';
import ApiRoute from '../../../../../apiroute'
export const addParkingMasterConfig = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const cartype_id = valuesObj.cartype_id ? valuesObj.cartype_id : null;
    const cpm_ref_id = null;
    const name_th = valuesObj.name_th
    const name_en = valuesObj.name_en
    const start_date = valuesObj.start_date
    const stop_date = valuesObj.stop_date
    const cpm_day_type = valuesObj.cpm_day_type
    const cpm_time_for_free = valuesObj.cpm_time_for_free
    const cpm_overnight_status = valuesObj.cpm_overnight_status
    const overnight_start = valuesObj.overnight_start
    const overnight_stop = valuesObj.overnight_stop
    const cpm_fine_amount = valuesObj.cpm_fine_amount
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id,
        cpm_ref_id,name_th,name_en
        ,start_date,stop_date,cpm_day_type
        ,cpm_time_for_free,cpm_overnight_status,overnight_start
        ,overnight_stop,cpm_fine_amount
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.create_paring_master_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}