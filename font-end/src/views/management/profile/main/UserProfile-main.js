import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
    CLabel
} from '@coreui/react'
import './UserProfile-main.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import moment from 'moment'
import { GetUserProfileByIDController } from './UserProfile-main-controller'
import InputDisable from '../../component/input/InputDisable'
import ImageBoxProfile from '../../component/image/ImageProfile'
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'

function UserProfileMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //----------------State
    const [refeshForm, setRefeshForm] = useState(false);
    const [userProfileObj, setUserProfileObj] = useState({
        employee_code: ""
        , prefix_name_th: ""
        , first_name_th: ""
        , last_name_th: ""
        , nick_name_th: ""
        , prefix_name_en: ""
        , first_name_en: ""
        , last_name_en: ""
        , nick_name_en: ""
        , address: ""
        , employee_mobile: ""
        , employee_line: ""
        , employee_email: ""
        , employee_picture_path: ""
        , company_name: ""
    });
    const [showLoading, setShowLoading] = useState(false);
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //----------------Form load
    useEffect(() => {
        refeshFormFunc();
    }, [])
    //-----------------Refesh Form
    if (refeshForm) {
        refeshFormFunc();
        setRefeshForm(false);
    }
    function refeshFormFunc() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = "wait";
            GetUserProfileByIDController({ authStore })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setUserProfileObj(result);
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page404");
                })
                .finally((value) => {
                    document.body.style.cursor = "default";
                    setShowLoading(false);
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    return (
        <CCard>
            {loadingmodal}
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader className="header-user-profile">
                            User Profile
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="12" md="12">
                                    <ImageBoxProfile
                                        link={userProfileObj.employee_picture_path}
                                    />
                                </CCol>
                            </CRow>
                            <br></br>
                            <br></br>
                            <CRow>
                                <CCol xs="12" sm="12" md="12">
                                    <InputDisable
                                        title="ชื่อโครงการ"
                                        text={userProfileObj.company_name}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="4">
                                    <InputDisable
                                        title="รหัสพนักงาน"
                                        text={userProfileObj.employee_code}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="2">
                                    <InputDisable
                                        title="คำนำหน้าชื่อ"
                                        text={userProfileObj.prefix_name_th}
                                    />
                                </CCol>
                                <CCol xs="12" sm="4" md="5">
                                    <InputDisable
                                        title="ชื่อ"
                                        text={userProfileObj.first_name_th}
                                    />
                                </CCol>
                                <CCol xs="12" sm="4" md="5">
                                    <InputDisable
                                        title="นามสกุล"
                                        text={userProfileObj.last_name_th}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="4">
                                    <InputDisable
                                        title="ชื่อเล่น"
                                        text={userProfileObj.nick_name_th}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="2">
                                    <InputDisable
                                        title="Prefix name"
                                        text={userProfileObj.prefix_name_en}
                                    />
                                </CCol>
                                <CCol xs="12" sm="4" md="5">
                                    <InputDisable
                                        title="First name"
                                        text={userProfileObj.first_name_en}
                                    />
                                </CCol>
                                <CCol xs="12" sm="4" md="5">
                                    <InputDisable
                                        title="Last name"
                                        text={userProfileObj.last_name_en}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="4">
                                    <InputDisable
                                        title="Nickname"
                                        text={userProfileObj.nick_name_en}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="7" md="7">
                                    <InputDisable
                                        title="อีเมล"
                                        text={userProfileObj.employee_email}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="4" md="4">
                                    <InputDisable
                                        title="เบอร์โทรศัพท์"
                                        text={userProfileObj.employee_mobile}
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>
        </CCard >
    );
}
export default UserProfileMain;