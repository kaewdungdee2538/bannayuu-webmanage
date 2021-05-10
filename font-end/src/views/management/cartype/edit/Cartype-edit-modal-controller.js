import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const editCartype = (props) => {
    const { authStore, valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_id = valuesObj.cartype_id;
    const name_th = valuesObj.name_th;
    const name_en = valuesObj.name_en;
    const name_contraction = valuesObj.name_contraction;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id,
        name_th, name_en,
        name_contraction,
        remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype.edit_cartype_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}


export const getCartypeById = (props) => {
    const { authStore, valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_id = valuesObj.cartype_id
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype.get_cartype_by_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const disableCartypeById = (props) => {
    const { authStore, valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_id = valuesObj.cartype_id;
    const remark = valuesObj.remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id,
        remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype.disable_cartype_utl}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}