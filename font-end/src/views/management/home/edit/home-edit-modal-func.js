import axios from 'axios';
import ApiRoute from '../../../../apiroute'

const getHomeInfo = (token) => {
    const default_value = {
        company_id: 1,
        company_code: "100",
        guardhouse_id: 1,
        guardhouse_code: "1001"
    }
    return axios.get(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_allhome_url}`
        , {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            , data: default_value
        }).then((res) => { return res.data.response })
}

export default getHomeInfo;

export const getHomeInfoByID = (props) => {
    const { home_id, authStore } = props
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        home_id
    }
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.get_home_byid_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => { return res.data.response })
        .catch(err => { 
            console.log(err);
        })
        .finally()
}

export const editHomeInfoByID = (props) =>{
    const {home_obj,authStore} = props
    
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        home_id : home_obj.home_id
        ,home_address : home_obj.home_address
        ,home_remark: home_obj.home_remark
    }
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.edit_homeinfo_url}`
    return axios.post(url,bodyParameters,config)
    .then(res=>res.data.response)
    .catch(err=>{console.log(err)})
    .finally()
}

export const deleteHomeByID = (props) =>{
    const {homeObj,authStore} = props
    console.log(homeObj)
    console.log(authStore)
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` }
    }
    const bodyParameters = {
        home_id : homeObj.home_id
    }
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.home.delete_homeinfo_url}`
    return axios.post(url,bodyParameters,config)
    .then(res=>res.data.response)
    .catch(err=>{console.log(err)})
    .finally()
}
