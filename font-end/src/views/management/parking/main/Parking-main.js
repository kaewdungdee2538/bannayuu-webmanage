import {
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Parking-main.css'
import LoadingModal from '../../component/loading/LoadingModal'
import ParkingMaster from '../master/Parking-master'
function ParkingMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    const [showLoading, setShowLoading] = useState(false);
    const [showMasterForm, setShowMasterForm] = useState(true);
    const [showHeaderForm, setShowHeaderForm] = useState(false);
    const [showSubForm, setShowSubForm] = useState(false);
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization)
            history.push("/");
    }, []);
    let masterFormElem = null;
    if (showMasterForm) {
        masterFormElem = <ParkingMaster
            setShowLoading={setShowLoading}
            setShowMasterForm={setShowMasterForm}
            setShowHeaderForm={setShowHeaderForm}
        />
    } else masterFormElem = null;
    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            <CCardHeader className="form-parking-head">ค่าบริการจอดรถ</CCardHeader>
            <CCardBody>
                {masterFormElem}
            </CCardBody>

        </CCard>)
}

export default ParkingMain;