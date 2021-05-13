import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getCartypeCategoryByID = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_category_id = valuesObj.cartype_category_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_category_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype_category.get_cartype_category_by_id_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const editCartypeCategory = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_category_id = valuesObj.cartype_category_id;
    const name_th = valuesObj.name_th
    const name_en = valuesObj.name_en
    const name_contraction = valuesObj.name_contraction
    const remark = valuesObj.remark
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }

    const bodyParameters = {
        company_id,
        cartype_category_id,
        name_th,name_en,
        name_contraction,
        remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype_category.edit_cartype_category_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const disableCartypeCategory = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_category_id = valuesObj.cartype_category_id;
    const remark = valuesObj.remark
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }

    const bodyParameters = {
        company_id,
        cartype_category_id,
        remark
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype_category.disable_cartype_category_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}
