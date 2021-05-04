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


export const editParkingMasterByCPMID = (props) => {
    const { authStore, valueObj } = props;
    const middleware = editParkingMasterMiddleware(valueObj);
    if (middleware)
        return { error: middleware, result: null }
    const company_id = authStore.company_id;
    const cpm_id = valueObj.cpm_id;
    const name_th = valueObj.name_th;
    const name_en = valueObj.name_en;
    const cartype_id = valueObj.cartype_id;
    const start_date = valueObj.start_date ? valueObj.start_date : null;
    const stop_date = valueObj.stop_date ? valueObj.stop_date : null;
    const cpm_day_type = valueObj.cpm_day_type;
    const cpm_time_for_free = valueObj.cpm_time_for_free ? valueObj.cpm_time_for_free : "00:00:00"
    const cpm_overnight_status = valueObj.cpm_overnight_status
    const overnight_start = valueObj.overnight_start ? valueObj.overnight_start : null;
    const overnight_stop = valueObj.overnight_stop ? valueObj.overnight_stop : null;
    const cpm_fine_amount = valueObj.cpm_fine_amount ? valueObj.cpm_fine_amount : 0;
    const remark = valueObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id, cpm_id, name_th, name_en
        , cartype_id, start_date, stop_date
        , cpm_day_type, cpm_time_for_free, cpm_overnight_status
        , overnight_start, overnight_stop, cpm_fine_amount, remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.edit_parking_master_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

function editParkingMasterMiddleware(valueObj) {
    // if(!valueObj.cpm_id)
    //     return 'กรุณาเลือก Master ก่อน กรุณาทำรายการใหม่';
    // else if()
    // valueObj.cpm_id
    // valueObj.name_th
    // valueObj.name_en
    // valueObj.cartype_id
    // valueObj.start_date
    // valueObj.stop_date
    // valueObj.cpm_day_type
    // valueObj.cpm_time_for_free
    // valueObj.cpm_overnight_status
    // valueObj.overnight_start
    // valueObj.overnight_stop
    // valueObj.cpm_fine_amount
    // valueObj.remark;
    return null;
}