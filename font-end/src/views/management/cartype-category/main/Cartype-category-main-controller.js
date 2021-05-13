import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const getCartypeAll = (props) => {
    const { authStore } = props
    const company_id = authStore.company_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype.get_cartype_all_url }`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

export const getCartypeCategoryAllById = (props) => {
    const { authStore,searchObj } = props
    const company_id = authStore.company_id;
    const cartype_id = searchObj.cartype_id;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        company_id,
        cartype_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype_category.get_cartype_category_all_url }`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}

