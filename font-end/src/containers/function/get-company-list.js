import axios from "axios";
import ApiRoute from "../../apiroute";

export const GetCompanyList = (props) => {
    const { authStore, searchObj } = props;
    const company_list = searchObj.company_list;

    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_list
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.company.get_company_list_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};
