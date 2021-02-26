import { createStore } from 'redux'

//GLOBAL STATE
const authState = {
    authorization: false
    , access_token: ''
    , company_id: ''
    , employee_code: ''
    , employee_id: ''
    , first_name_th: ''
    , last_name_th: ''
}
//ACTION
export const enaAuthenticationLogin = (props) => {
    return {
        type: 'ENABLE_AUTH'
        , data: props
    }
}

export const disAuthenticationLogin = () => {
    return {
        type: 'DISABLE_AUTH'
        , data: authState
    }
}
//REDUCER
const loginAuthentication = (state = authState, action) => {
    switch (action.type) {
        case "ENABLE_AUTH":
            return { ...state, ...action.data };
        case "DISABLE_AUTH":
            return { ...state };
        default:
            return { ...state };
    }
}

const authstore = createStore(
    loginAuthentication
    , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default authstore;