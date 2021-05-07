import { useState, useEffect } from 'react'
import './License-license.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../../store'
import { getLicenseByHomeId } from './License-license-controller'
import LicenseModalAdd from '../add/License-lincese-modal-add'
import LicenseEditModalMain from '../edit/modal/License-edit-modal-main'
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'inactive': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
const fields = ['แก้ไข', 'ทะเบียนรถ', 'สถานะ']


const LicenseLicense = (props) => {
    const history = useHistory();
    const authStore = useSelector(store => store);
    const { setShowLoading, selectedRow, setSelectedRow, setShowHomeForm, setShowLicenseForm } = props
    const [licenseInfo, setLicenseInfo] = useState(null)
    const [refeshForm, setRefeshForm] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({ home_car_id: "" });
    //--------------------Form Load
    useEffect(() => {
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
            const searchObj = { home_id: selectedRow.home_id }
            getLicenseByHomeId({ authStore, searchObj }).then(res => {
                if (res.result) {
                    if (res.result.length > 0)
                        setLicenseInfo(res.result)
                    else {
                        setLicenseInfo([]);
                    }
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error;
                }
            }).catch(err => {
                console.log(err)
                history.push('/page500')
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
    //---------------------function edit license
    function onClickShowEditModal(event) {
        const home_car_id = event.target.getAttribute('home_car_id');
        setSelectedObj({ home_car_id });
        setShowEditModal(true);
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
    //-----------------------Show Add License
    let licenseModalAddElem = null;
    if (showAddModal) {
        licenseModalAddElem = <LicenseModalAdd
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
            selectedRow={selectedRow}
        />
    } else licenseModalAddElem = null;
    //---------------------Show Edit License
    let licenseModalEditElem = null;
    if (showEditModal) {
        licenseModalEditElem = <LicenseEditModalMain
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setSelectedObj={selectedObj}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    } else licenseModalEditElem = null;
    //------------------------------------------
    return (
        <div>
            {licenseModalAddElem}
            {licenseModalEditElem}
            <div className="btn-addparcel">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowAddModal(true)}
                ><span>เพิ่มทะเบียนรถลูกบ้าน</span></CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            License Table
                        </CCardHeader>
                        <CDataTable
                            // onRowClick={onEditRowClick}
                            className="tb-modal-td"
                            items={licenseInfo}
                            fields={fields}
                            striped
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                                'ทะเบียนรถ': (item) => (
                                    <td>
                                        <span>{item.home_car_license_plate}</span>
                                    </td>
                                ),
                                'แก้ไข': (item) => (
                                    <td>
                                        <CButton
                                            home_car_id={item.home_car_id}
                                            home_car_code={item.home_car_code}
                                            onClick={onClickShowEditModal}
                                            className="btn-class btn-edit"
                                            color="primary">
                                            <CIcon
                                                home_car_id={item.home_car_id}
                                                home_car_code={item.home_car_code}
                                                name="cil-check"
                                                color="danger" />
                                            <span
                                                home_car_id={item.home_car_id}
                                                home_car_code={item.home_car_code}
                                                className="btn-icon">แก้ไข</span>
                                        </CButton>

                                    </td>
                                ), 'สถานะ': (item) => (
                                    <td>
                                        <CBadge color={getBadge(item.status)}>
                                            {item.status}
                                        </CBadge>
                                    </td>
                                )
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