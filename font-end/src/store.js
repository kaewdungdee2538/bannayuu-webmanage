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

var globalState={
  sidebarShow: "responsive"
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
      globalState = { ...state, ...rest };
      return { ...state, ...rest };
    case "ENABLE_AUTH":
      globalState =  { ...state, ...data };
      localStorage.setItem('authStorage',JSON.stringify(globalState))
      return globalState;
    case "DISABLE_AUTH":
      globalState = initialState;
      localStorage.setItem('authStorage',JSON.stringify(globalState))
      return globalState;
    case "SELECT_HOME":
      globalState = { ...state, ...data };
      localStorage.setItem('authStorage',JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_HOME":
      globalState = { ...state, ...data };
      localStorage.setItem('authStorage',JSON.stringify(globalState))
      return globalState;
    default:
      const localStr = localStorage.getItem('authStorage')
      const localStageReturn = !localStr ? state : JSON.parse(localStr);
      return localStageReturn;
  }
};

const store = createStore(
  changeState,
  // ,loginAuthentication
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
