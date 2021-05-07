import {
    CCol,
    CRow,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import '../main/Parking-main.css'
import './Parking-header.css'
import swal from 'sweetalert';
import store, { disAuthenticationLogin, selectCPH } from '../../../../store'
import { getParkingHeaderAll } from './Parking-header-controller'
import { getDayTypeName } from '../data/parking-data'
import ParkingHeaderAddModal from './add-modal/Parking-header-add-modal'
import ParkingHeaderTable from './Parking-header-table'
import ParkingHeaderInfo from './Parking-header-info'

function ParkingHeader(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cpm_id = authStore.cpm_id;
    const cpm_name_th = authStore.cpm_name_th
    const cpm_name_en = authStore.cpm_name_en
    const cartype_name_th = authStore.cartype_name_th
    const cpm_day_type = getDayTypeName(authStore.cpm_day_type)
    //------------------Props
    const { setShowLoading
        , setShowMasterForm
        , setShowHeaderForm
        , setShowMasterEditForm
    } = props;
    //------------------State
    const [parkingHeaderObj, setParkingHeaderObj] = useState(null);
    const [resfeshForm, setRefeshForm] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showParkingHeaderTable, setShowParkingHeaderTable] = useState(true);
    const [showParkingHeaderInfo, setShowParkingHeaderInfo] = useState(false);
    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            refeshForm();
        }
    }, []);
    //--------------Reset form
    function refeshForm() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = {
            cpm_id
        }
        getParkingHeaderAll({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) setParkingHeaderObj(res.result);
                    else setParkingHeaderObj([]);
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error
                } else swal("Warning!", res.error, "warning");
            })
            .catch((err) => {
                console.log(err);
                history.push("/page500");
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                setRefeshForm(false);
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }
    if (resfeshForm) {
        refeshForm();
    }

    // //----------------Search
    // function onSearchClick(event) {
    //     setShowLoading(true);
    //     refeshForm();
    // }
    // //---------------Show edit form
    // function onViewClick(event) {
    //     const cph_id = event.target.getAttribute("cph_id");
    //     store.dispatch(selectCPH({ cph_id }));
    //     setShowHeaderForm(false);
    // }
    // //----------------On Back Click
    // function onBackClick(event) {
    //     setShowHeaderForm(false);
    //     setShowMasterEditForm(true);
    // }
    //------------------Show add master modal
    let parkingHeaderAddModalElem = null;
    if (showModalAdd) {
        parkingHeaderAddModalElem = <ParkingHeaderAddModal
            showModalAdd={showModalAdd}
            setShowModalAdd={setShowModalAdd}
            setRefeshForm={setRefeshForm}
            cpm_id={cpm_id}
            setShowLoading={setShowLoading}
        />
    } else parkingHeaderAddModalElem = null;
    //-------------------Show Header Table
    let parkingHeaderTableElem = null;
    if (showParkingHeaderTable) {
        parkingHeaderTableElem = <ParkingHeaderTable
            setShowLoading={setShowLoading}
            setShowMasterForm={setShowMasterForm}
            setShowHeaderForm={setShowHeaderForm}
            setShowMasterEditForm={setShowMasterEditForm}
            parkingHeaderObj={parkingHeaderObj}
            setShowModalAdd={setShowModalAdd}
            setShowParkingHeaderTable={setShowParkingHeaderTable}
            setShowParkingHeaderInfo = {setShowParkingHeaderInfo}
        />
    }else parkingHeaderTableElem = null;
    //-------------------Show Header Info
    let parkingHeaderInfoElem = null;
    if(showParkingHeaderInfo){
        parkingHeaderInfoElem = <ParkingHeaderInfo
        setShowLoading={setShowLoading}
        setShowParkingHeaderTable={setShowParkingHeaderTable}
        setShowParkingHeaderInfo = {setShowParkingHeaderInfo}
        />
    }else parkingHeaderInfoElem = null;
    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            {parkingHeaderAddModalElem}
            <CRow><h2>ประเภท : {cartype_name_th}</h2></CRow>
            <CRow><h5>ชื่อ Master : {cpm_name_th} ({cpm_name_en})</h5></CRow>
            <CRow><span>วัน : ({cpm_day_type})</span></CRow>
            <br></br>
            {parkingHeaderTableElem}
            <CRow>{parkingHeaderInfoElem}</CRow>
        </CCol>
    )
}

export default ParkingHeader;