import { useState, useEffect } from 'react'
import './License-main.css'
import {
    CCard,
    CCardHeader,
} from '@coreui/react'
import LoadingModal from '../../component/loading/LoadingModal'
import LicenseHome from '../home/License-home'
import LicenseLicense from '../license/main/License-license'
const LicenseMain = () => {
    //-------------------State
    const [showLoading, setShowLoading] = useState(false);
    const [showHomeForm, setShowHomeForm] = useState(true);
    const [showLicenseForm, setShowLicenseForm] = useState(false);
    
    //-------------------Show loading spiner
    useEffect(()=>{

    },[])
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //--------------------Form Load
    
    const [selectedRow, setSelectedRow] = useState( {selected:false,home_id: '' });
    //--------------------function clear data
    function clearData(){
        setSelectedRow({selected:false,home_id: '' })
    }
    //--------------------Set Start form
    let elemHome = null;
    if(showHomeForm){
        elemHome =<LicenseHome
        key={Date.now}
        setShowLoading={setShowLoading}
        clearData={clearData}
        setSelectedRow={setSelectedRow}
        setShowHomeForm={setShowHomeForm}
        setShowLicenseForm={setShowLicenseForm}
        />
    }else elemHome = null;
    
    //------------------Set show 
    let elemLicense = null;
    if(showLicenseForm){
        elemLicense = <LicenseLicense
        key={Date.now}
        setShowLoading={setShowLoading}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setShowHomeForm={setShowHomeForm}
        setShowLicenseForm={setShowLicenseForm}
        />
    }else elemLicense = null;

    return (
        <CCard>
             <CCardHeader className="home-license-form-head">จัดการทะเบียนรถลูกบ้าน</CCardHeader>
            {loadingmodal}
            {elemHome}
            {elemLicense}
        </CCard>
    )
}

export default LicenseMain