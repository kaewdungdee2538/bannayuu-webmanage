import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getParkingHeaderAll = (props) => {
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
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_header_all_by_cpm_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const getParkingHeaderByCPHID = (props) => {
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
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.get_parking_header_by_cph_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const editParkingHeaderByCPHID = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const priority_no = valuesObj.priority_no;
    const cpm_id = valuesObj.cpm_id ? valuesObj.cpm_id : null;
    const cph_id = valuesObj.cph_id ? valuesObj.cph_id : null;
    const cartype_id = valuesObj.cartype_id ? valuesObj.cartype_id : null;
    const name_th = valuesObj.name_th;
    const name_en = valuesObj.name_en;
    const interval_every = valuesObj.interval_every;
    const amount_value_for_cal = valuesObj.amount_value_for_cal;
    const remark = valuesObj.remark;
    const start_time_zone = priority_no.toUpperCase() === "FIRST" ? "00:00:00" : valuesObj.start_time_zone ;
    const stop_time_zone = priority_no.toUpperCase() === "FIRST" ? "23:59:59" : valuesObj.stop_time_zone;
    //-------------------------URL
    const url_for_first = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.edit_parking_header_first_url}`;
    const url_for_second = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.edit_parking_header_second_url}`
    const url_path = priority_no.toUpperCase() === "FIRST" ? url_for_first :  url_for_second;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,cpm_id,cph_id,cartype_id
        ,name_th,name_en,interval_every,amount_value_for_cal
        ,remark,start_time_zone,stop_time_zone
    }
    return axios.post(url_path
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const disableParkingHeaderByCPHID = (props) => {
    const { authStore, valuesObj } = props;
    const company_id = authStore.company_id;
    const cph_id = valuesObj.cph_id ? valuesObj.cph_id : null;
    const remark = valuesObj.remark;
    //-------------------------URL
    const url_path = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.parking.disable_parking_header_url}`;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,cph_id
        ,remark
    }
    return axios.post(url_path
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}