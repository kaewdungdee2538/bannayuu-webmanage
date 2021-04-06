import { useState, useEffect } from 'react'
import './License-home.css'
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
import { getHomeInfo } from './License-home-controller'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { convertTZ } from '../../../../utils'
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
const fields = ['บ้านเลขที่', 'เลือกบ้าน']


const LicenseHome = (props) => {
    const history = useHistory();
    const authStore = useSelector(store => store);
    const [homeInfo, setHomeInfo] = useState(null)
    const [refeshForm, setRefeshForm] = useState(false);
    const { setShowLoading, clearData, setSelectedRow, setShowHomeForm, setShowLicenseForm } = props
    const [address, setAddress] = useState('');

    //--------------------Form Load
    useEffect(() => {
        clearData();
        setShowLoading(true)
        refesh();
    }, []);
    //-------------------Refesh form
    function refesh() {
        if (!authStore.authorization) {
            history.push('/')
        } else {
            let isNotAuth;
            document.body.style.cursor = 'wait';
            const searchObj = { home_address: address }
            getHomeInfo({ authStore, searchObj }).then(res => {
                if (res.result) {
                    if (res.result.length > 0)
                        setHomeInfo(res.result)
                    else {
                        setHomeInfo(null);
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error;
                }
            }).catch(err => {
                console.log(err)
                history.push('/page404')
            }).finally(value => {
                document.body.style.cursor = 'default';
                setShowLoading(false);
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
                setRefeshForm(false);
            })
        }
    }
    if (refeshForm) {
        refesh();
    }

    //---------------------search
    function onSearchClick(event) {
        refesh();
    }
    //----------------------on select click
    function onSelectClick(event) {
        const home_id = event.target.getAttribute('home_id');
        setSelectedRow({ selected: true, home_id })
        setShowHomeForm(false)
        setShowLicenseForm(true);
    }
  
    //------------------------------------------
    return (
        <div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Home Table
            </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <InputEnable
                                        title="ที่อยู่"
                                        placeholder="Enter home number"
                                        maxLength="30"
                                        text={address}
                                        setText={setAddress}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="12" md="12">
                                    <CButton
                                        className="btn-class btn-head btn-search"
                                        color="info"
                                        onClick={onSearchClick}
                                    >
                                        <CIcon
                                            name="cil-magnifying-glass"
                                            color="info" />
                                        <span className="span-head">ค้นหา</span>
                                    </CButton>
                                </CCol>
                            </CRow>
                            <br></br>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={homeInfo}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'บ้านเลขที่': (item) => (
                                        <td>
                                            <span>{item.home_address}</span>
                                        </td>
                                    ),
                                    'เลือกบ้าน': (item) => (
                                        <td>
                                            <CButton
                                                className="btn-class"
                                                color="primary"
                                                home_id={item.home_id}
                                                onClick={onSelectClick}
                                            >
                                                เลือกบ้าน
                                          </CButton>
                                        </td>
                                    ),
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
               
            </CCardBody>
        </div>
    )
}

export default LicenseHome