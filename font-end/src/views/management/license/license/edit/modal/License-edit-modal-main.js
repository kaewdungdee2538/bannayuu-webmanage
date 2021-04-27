import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import './License-edit-modal-main.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    CModal,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import store, { disAuthenticationLogin } from '../../../../../../store'
import { getLicenseByCarId } from './License-edit-modal-main-controller'
import LicenseEditModalInfo from '../info/License-edit-modal-info'
import LicenseEditModalHomeChange from '../home-change/License-edit-modal-home-change'
const LicenseEditModalMain = ({ showEditModal, setShowEditModal, setSelectedObj, setShowLoading, setRefeshForm }) => {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------------------State
    const [CarObj, setCarObj] = useState({
        home_car_id: "", home_id: "", home_address: ""
        , home_car_code: "", home_car_license_plate: "", home_car_name: ""
        , home_car_brand: "", home_car_remark: "", status: ""
        , create_by: "", create_date: "", company_name: ""
    })
    const [showFirstModal, setShowFirstModal] = useState(false);
    const [showHomeChangeModal, setShowHomeChangeModal] = useState(false);
    //--------------------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            getLicenseByCarId({ authStore, setSelectedObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        setCarObj(result);
                        setShowFirstModal(true);
                    } else if (res.statusCode === 401) {
                        isNotAuth = res.error;
                    } else swal("Warning!", res.error, "warning");
                })
                .catch((err) => {
                    console.log(err);
                    history.push("/page500");
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
    }, [])
    //--------------------------Close Modal
    function closeModal(event) {
        setShowEditModal(false);
        setRefeshForm(true);
    }
    //--------------------------if show first modal
    let licenseModalFirst = null;
    if (showFirstModal) {
        licenseModalFirst = <LicenseEditModalInfo
            CarObj={CarObj}
            closeModal={closeModal}
            setShowFirstModal={setShowFirstModal}
            setShowHomeChangeModal={setShowHomeChangeModal}
            setShowLoading={setShowLoading}
            setRefeshForm={setRefeshForm}
        />
    } else licenseModalFirst = null;
    //------------------------if show home change
    let licenseModalHomeChange = null;
    if (showHomeChangeModal) {
        licenseModalHomeChange = <LicenseEditModalHomeChange
            closeModal={closeModal}
            CarObj={CarObj}
            setShowLoading={setShowLoading}
            setRefeshForm={setRefeshForm}
        />
    } else licenseModalHomeChange = null;
    //--------------------------------------------
    return (
        <CModal
            show={showEditModal}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="none"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-parcel-change">
                <CModalTitle>แก้ไขทะเบียนรถลูกบ้าน</CModalTitle>
            </CModalHeader>
            {licenseModalFirst}
            {licenseModalHomeChange}
        </CModal>
    )
}

export default LicenseEditModalMain;