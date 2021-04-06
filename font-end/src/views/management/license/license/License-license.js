import { useState, useEffect } from 'react'
import './License-license.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CDataTable,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../store'
import InputEnable from '../../component/input/InputEnable'
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'inactive': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
const fields = ['แก้ไข', 'ทะเบียนรถ']


const LicenseLicense = (props) => {
    const history = useHistory();
    const authStore = useSelector(store => store);
    const [homeInfo, setHomeInfo] = useState(null)
    const [refeshForm, setRefeshForm] = useState(false);
    const { setShowLoading, selectedRow, setSelectedRow ,setShowHomeForm, setShowLicenseForm} = props
    //--------------------Form Load
    useEffect(() => {
        // setShowLoading(true)
        // refesh();
    }, []);
    //-------------------Refesh form
    function refesh() {
        if (!authStore.authorization) {
            history.push('/')
        } else {
            let isNotAuth;
            document.body.style.cursor = 'wait';
            const searchObj = { home_id: selectedRow.home_id }
            // getHomeInfo({ authStore, searchObj }).then(res => {
            //     if (res.result) {
            //         if (res.result.length > 0)
            //             setHomeInfo(res.result)
            //         else {
            //             setHomeInfo(null);
            //         }
            //     } else if (res.statusCode === 401) {
            //         isNotAuth = res.error;
            //     }
            // }).catch(err => {
            //     console.log(err)
            //     history.push('/page404')
            // }).finally(value => {
            //     document.body.style.cursor = 'default';
            //     setShowLoading(false);
            //     if (isNotAuth) {
            //         swal("Warning!", isNotAuth, "warning");
            //         history.push("/");
            //         //clear state global at store 
            //         store.dispatch(disAuthenticationLogin());
            //     }
            //     setRefeshForm(false);
            // })
        }
    }
    if (refeshForm) {
        refesh();
    }
    //---------------------function select licen
    function onSelectLicenseClick(event){

    }
    //---------------------search
    function onSearchClick(event) {
        refesh();
    }
      //----------------------on back click
      function onGoBackClick(event) {
        setShowLicenseForm(false);
        setShowHomeForm(true);
    }
    //------------------------------------------
    return (
        <div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            License Table
                        </CCardHeader>
                        <CDataTable
                            // onRowClick={onEditRowClick}
                            className="tb-modal-td"
                            items={homeInfo}
                            fields={fields}
                            striped
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                                'ทะเบียนรถ': (item) => (
                                    <td>
                                        <span>{item.home_address}</span>
                                    </td>
                                ),
                                'แก้ไข': (item) => (
                                    <td>
                                        <CButton
                                            className="btn-class"
                                            color="primary"
                                            home_id={item.home_id}
                                            onClick={onSelectLicenseClick}
                                        >
                                            แก้ไข
                                          </CButton>
                                    </td>
                                ),
                            }
                            }
                        />
                    </CCard>
                </CCol>
                <CButton
                    className="btn-class"
                    color="danger"
                    onClick={onGoBackClick}
                >
                    ย้อนกลับ
                </CButton>
            </CCardBody>
        </div >
    )
}

export default LicenseLicense