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

var globalState = {
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
    data: { ...props, home_selected: null },
  };
};

export const selectCPM = (props) => {
  return {
    type: "SELECT_CPM",
    data: props,
  };
};
export const unSelectCPM = (props) => {
  return {
    type: "UNSELECT_CPM",
    data: { ...props, cpm_id: null, cartype_id: null },
  };
};

export const selectCPH = (props) => {
  return {
    type: "SELECT_CPH",
    data: props,
  };
};
export const unSelectCPH = (props) => {
  return {
    type: "UNSELECT_CPH",
    data: { ...props, cph_id: null },
  };
};

export const selectCPS = (props) => {
  return {
    type: "SELECT_CPS",
    data: props,
  };
};
export const unSelectCPS = (props) => {
  return {
    type: "UNSELECT_CPS",
    data: { ...props, cps_id: null },
  };
};

export const selectCartype = (props) => {
  return {
    type: "SELECT_CARTYPE",
    data: props,
  };
};
export const unSelectCartype = (props) => {
  return {
    type: "UNSELECT_CARTYPE",
    data: { ...props, cartype_id: null },
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
      globalState = { ...state, ...data };
      localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "DISABLE_AUTH":
      globalState = initialState;
      localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "SELECT_HOME":
      globalState = { ...state, ...data };
      localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_HOME":
      globalState = { ...state, ...data };
      localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "SELECT_CPM":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_CPM":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "SELECT_CPH":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_CPH":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "SELECT_CPS":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_CPS":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "SELECT_CARTYPE":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
      return globalState;
    case "UNSELECT_CARTYPE":
      globalState = { ...state, ...data };
      // localStorage.setItem('authStorage', JSON.stringify(globalState))
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
