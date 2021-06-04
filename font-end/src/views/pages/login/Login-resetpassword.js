import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    CButton,
    CCol,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import { isNotEngCharOrNumber } from '../../../utils/utils'
import LoginResetPassowrdController from './Login-resetpassword-controller'
import { OuanIconForBtn } from '../../../containers/function/OuanIcon'

function LoginReSetPassword(props) {
    const { employeeObj, username, defualt_password, setShowLoading } = props;
    const history = useHistory();
    const [passwordObj, setPasswordObj] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: ""
    });
    //-------------------on password enter
    function onPasswordEnter(event) {
        if (event.key === 'Enter') {
            if (resetPasswordMiddleware())
                resetPassword();
        }
    }
    //--------------------on Login click
    async function onChangePasswordClick(event) {
        event.preventDefault();
        if (resetPasswordMiddleware())
            resetPassword();
    }
    //-------------------reset password
    function resetPassword() {
        const valuesObj = {
            company_id: employeeObj.company_id,
            username,
            old_password: passwordObj.current_password,
            new_password: passwordObj.new_password,
            employee_id: employeeObj.employee_id
        }
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = 'wait';
        LoginResetPassowrdController({ valuesObj })
            .then(res => {
                if (res.error) {
                    if (res.statusCode === 401) {
                        isNotAuth = res.error
                    } else swal({
                        title: "Warning.",
                        text: res.message,
                        icon: "warning",
                        button: "OK",
                    });
                    setShowLoading(false)
                } else {
                    setShowLoading(false)
                    swal({
                        title: "Success.",
                        text: "เปลี่ยนรหัสผ่านเรียบร้อย",
                        icon: "success",
                        button: "OK",
                    }).then(() => {
                        window.location.reload(false);
                    })
                }
                document.body.style.cursor = 'default';
            }).catch((err) => {
                console.log(err);
                history.push("/page500");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                }
            });
    }
    //-------------------reset password middleware
    function resetPasswordMiddleware() {
        if (defualt_password !== passwordObj.current_password) {
            swal("Warning!", "รหัสผ่านเก่าไม่ถูกต้อง", "warning");
            return false;
        } else if (isNotEngCharOrNumber(passwordObj.new_password) || isNotEngCharOrNumber(passwordObj.confirm_new_password)) {
            swal("Warning!", "รหัสผ่านใหม่ จะต้องเป็นตัวเลขหรืออักษรภาษาอังกฤษเท่านั้น", "warning");
            return false;
        } else if (passwordObj.new_password !== passwordObj.confirm_new_password) {
            swal("Warning!", "รหัสผ่านใหม่ไม่ตรงกัน", "warning");
            return false;
        } else if (defualt_password == passwordObj.new_password) {
            swal("Warning!", "รหัสผ่านเก่า และรหัสผ่านใหม่ ห้ามตรงกัน", "warning");
            return false;
        }
        return true;
    }
    //---------------------------------
    return (
        <CForm>
            <h1>Reset Password</h1>
            <p className="text-muted">Change to your new password</p>
            <CInputGroup className="mb-3">
                <CInputGroupPrepend>
                    <CInputGroupText>
                        <OuanIconForBtn name="RiLockLine" />
                    </CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                    onChange={event => setPasswordObj({ ...passwordObj, current_password: event.target.value })}
                    name="current-password"
                    value={passwordObj.current_password}
                    type="password"
                    placeholder="Current Password"
                    autoComplete="username" />
            </CInputGroup>
            <CInputGroup className="mb-4">
                <CInputGroupPrepend>
                    <CInputGroupText>
                        <OuanIconForBtn name="RiRotateLockFill" />
                    </CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                    onChange={event => setPasswordObj({ ...passwordObj, new_password: event.target.value })}
                    onKeyDown={onPasswordEnter}
                    name="new-password"
                    value={passwordObj.new_password}
                    type="password"
                    placeholder="New Password"
                    autoComplete="new-password" />
            </CInputGroup>
            <CInputGroup className="mb-4">
                <CInputGroupPrepend>
                    <CInputGroupText>
                        <OuanIconForBtn name="RiRotateLockFill" />
                    </CInputGroupText>
                </CInputGroupPrepend>
                <CInput
                    onChange={event => setPasswordObj({ ...passwordObj, confirm_new_password: event.target.value })}
                    onKeyDown={onPasswordEnter}
                    name="confirm-new-password"
                    value={passwordObj.confirm_new_password}
                    type="password"
                    placeholder="Confirm New Password"
                    autoComplete="confirm-new-password" />
            </CInputGroup>
            <CRow>
                <CCol xs="6">
                    <CButton
                        onClick={onChangePasswordClick}
                        color="primary"
                        className="px-4">Change Password</CButton>
                </CCol>
                {/* <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol> */}
            </CRow>
        </CForm>
    );
}
export default LoginReSetPassword;