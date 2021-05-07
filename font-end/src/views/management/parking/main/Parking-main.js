import {
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin } from '../../../../store'
import swal from 'sweetalert';
import './Parking-main.css'
import LoadingModal from '../../component/loading/LoadingModal'
import ParkingMaster from '../master/Parking-master'
import ParkingMasterEdit from '../master/Parking-master-edit'
import ParkingHeader from '../header/Parking-header'
import { getCartypesInfoAll } from './Parking-main-controller'

function ParkingMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)
    //-------------------State
    //-------------------------Set Form
    const [showLoading, setShowLoading] = useState(false);
    const [showMasterForm, setShowMasterForm] = useState(true);
    const [showMasterEditForm, setShowMasterEditForm] = useState(false);
    const [showHeaderForm, setShowHeaderForm] = useState(false);
    // const [showSubForm, setShowSubForm] = useState(false);

    //--------------------------Object

    const [cartypesInfoArr, setCartypesInfoArr] = useState([]);
    const [cartypesInfoForCreateArr, setCartypesInfoForCreateArr] = useState([]);
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
        getCartypesAll();
    }, []);
    //---------------Get cartype all
    function getCartypesAll() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        getCartypesInfoAll({ authStore })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) {
                        const result = res.result.map((item) => { return { id: item.cartype_id, value: item.cartype_name_th } });
                        let cartypeArr = [...result];
                        let carTypeArr2 = [...result];
                        setCartypesInfoForCreateArr(cartypeArr);
                        carTypeArr2.unshift({
                            id: 0,
                            value: "เลือกทั้งหมด"
                        })
                        setCartypesInfoArr(carTypeArr2);
                    }
                    else setCartypesInfoArr([]);
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
                setShowLoading(false)
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }
    //---------------------Master Form
    let masterFormElem = null;
    if (showMasterForm) {
        masterFormElem = <ParkingMaster
            setShowLoading={setShowLoading}
            setShowMasterForm={setShowMasterForm}
            setShowHeaderForm={setShowHeaderForm}
            cartypesInfoArr={cartypesInfoArr}
            cartypesInfoForCreateArr={cartypesInfoForCreateArr}
            setShowMasterEditForm={setShowMasterEditForm}
        />
    } else masterFormElem = null;
    //--------------------Master Form For Edit
    let masterFormEditElem = null;
    if (showMasterEditForm) {
        masterFormEditElem = <ParkingMasterEdit
            setShowLoading={setShowLoading}
            setShowMasterForm={setShowMasterForm}
            setShowHeaderForm={setShowHeaderForm}
            setShowMasterEditForm={setShowMasterEditForm}
        />
    } else masterFormEditElem = null;
     //--------------------Header Form
     let headerFormElem = null;
     if (showHeaderForm) {
        headerFormElem = <ParkingHeader
             setShowLoading={setShowLoading}
             setShowMasterForm={setShowMasterForm}
             setShowMasterEditForm={setShowMasterEditForm}
             setShowHeaderForm={setShowHeaderForm}
         />
     } else headerFormElem = null;

    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            <CCardHeader className="form-parking-head">ค่าบริการจอดรถ</CCardHeader>
            <CCardBody>
                {masterFormElem}
                {masterFormEditElem}
                {headerFormElem}
            </CCardBody>

        </CCard>)
}

export default ParkingMain;