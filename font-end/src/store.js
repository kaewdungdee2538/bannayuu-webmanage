import { createStore } from "redux";

//GLOBAL STATE
const initialState = {
  sidebarShow: "responsive",
  authorization: false,
  access_token: "",
  company_id: "",
  employee_code: "",
  employee_id: "",
  first_name_th: "",
  last_name_th: "",
  home_selected: null,
};

//ACTION
export const enaAuthenticationLogin = (props) => {
  return {
    type: "ENABLE_AUTH",
    data: props,
  };
};

export const disAuthenticationLogin = () => {
  return {
    type: "DISABLE_AUTH",
    data: initialState,
  };
};

export const selectHome = (props) => {
  return {
    type: "SELECT_HOME",
    data: props,
  };
};
export const unSelectHome = (props) => {
  return {
    type: "UNSELECT_HOME",
    data: {...props,home_selected: null},
  };
};
//REDUCER

const changeState = (state = initialState, { type, ...rest }) => {
  const data = { ...rest.data };
  switch (type) {
    case "set":
      return { ...state, ...rest };
    case "ENABLE_AUTH":
      return { ...state, ...data };
    case "DISABLE_AUTH":
      return { ...state };
    case "SELECT_HOME":
      return { ...state, ...data };
    case "UNSELECT_HOME":
      return { ...state, ...data };
    default:
      return state;
  }
};

const store = createStore(
  changeState,
  // ,loginAuthentication
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
