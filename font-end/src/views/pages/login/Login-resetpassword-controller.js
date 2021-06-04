import axios from 'axios';
import ApiRoute from '../../../apiroute'
const LoginResetPassowrdController = (props) => {
    const { valuesObj } = props;
    const company_id = valuesObj.company_id;
    const username = valuesObj.username;
    const old_password = valuesObj.old_password;
    const new_password = valuesObj.new_password;
    const employee_id = valuesObj.employee_id;
    const bodyParameters = {
        company_id,
        username,
        old_password,
        new_password,
        employee_id
    }
    return axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.login.save_reset_password_url}`
        , bodyParameters
    ).then((res) => { return res.data.response })
}

export default LoginResetPassowrdController;