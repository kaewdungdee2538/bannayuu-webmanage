import axios from 'axios';
import ApiRoute from '../../../../apiroute'
export const createCartypeCategory = (props) => {
    const { authStore,valuesObj } = props
    const company_id = authStore.company_id;
    const cartype_id = valuesObj.cartype_id;
    const name_th = valuesObj.name_th
    const name_en = valuesObj.name_en
    const name_contraction = valuesObj.name_contraction
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }

    const bodyParameters = {
        company_id,
        cartype_id,
        name_th,name_en,
        name_contraction
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.cartype_category.create_cartype_category_url}`
        , bodyParameters
        , config
    ).then((res) => { return res.data.response })
}
