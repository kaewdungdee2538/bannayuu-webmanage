import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import swal from 'sweetalert';
import ApiRoute from '../../../apiroute'
import store, { enaAuthenticationLogin } from '../../../store'
const Login = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    username: '', password: ''
  });
  function usernameOnChange(event) {
    const { name, value } = event.target
    setUser((userItem) => {
      return { ...userItem, [name]: value }
    })
  }
  function passwordOnChange(event) {
    const { name, value } = event.target
    setUser((userItem) => {
      return { ...userItem, [name]: value }
    })
  }

  //-------------------on password enter
  function onPasswordEnter(event) {
    if (event.key === 'Enter')
      Login();
  }
  //--------------------on Login click
  async function onLoginClick(event) {
    event.preventDefault();
    Login();
  }
  async function Login() {
    axios.post(`${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.login.login_url}`
      , user)
      .then(res => {
        const response = res.data.response
        if (response.error) {
          swal({
            title: "Warning!",
            text: response.error,
            icon: "warning",
            button: "OK",
          });
        } else {
          const result = response.result
          const employee = {
            authorization: true
            , access_token: result.access_token
            , company_id: result.employee.company_id
            , employee_code: result.employee.employee_code
            , employee_id: result.employee.employee_id
            , first_name_th: result.employee.first_name_th
            , last_name_th: result.employee.last_name_th
          }
          //set global store
          store.dispatch(enaAuthenticationLogin(employee));
          history.push('/main')
        }

      }).catch(err => {
        swal({
          title: "Warning!",
          text: "เชื่อมต่อ Server ล้มเหลว",
          icon: "warning",
          button: "OK",
        });
      })
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        onChange={usernameOnChange}
                        name="username"
                        value={user.username}
                        type="text"
                        placeholder="Username"
                        autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        onChange={passwordOnChange}
                        onKeyDown={onPasswordEnter}
                        name="password"
                        value={user.password}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          onClick={onLoginClick}
                          color="primary"
                          className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
