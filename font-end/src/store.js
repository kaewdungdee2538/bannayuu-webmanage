import { createStore } from 'redux'


//GLOBAL STATE
const initialState = {
  sidebarShow: 'responsive'
  , authorization: false
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
    , data: initialState
  }
}
//REDUCER

const changeState = (state = initialState, { type, ...rest }) => {
const data = {...rest.data}
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case "ENABLE_AUTH":
      return { ...state, ...data };
    case "DISABLE_AUTH":
      return { ...state };
    default:
      return state
  }
}

const store = createStore(
  changeState
  // ,loginAuthentication
  , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store