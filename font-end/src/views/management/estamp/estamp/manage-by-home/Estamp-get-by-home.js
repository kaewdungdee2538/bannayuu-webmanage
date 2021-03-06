import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Estamp-get-by-home.css'
import swal from 'sweetalert';
import { EstampGetByHomeController } from './Estamp-get-by-home-controller'
import EstampGetAll from '../manage-all/Estamp-get-all'
import store, { disAuthenticationLogin } from '../../../../../store'

const fields = ['บ้านเลขที่', 'เลือกบ้าน']

function EstampGetByHome(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const { setShowLoading } = props
    //--------------State
    const [homeObj, setHomeObj] = useState([])
    const [showVisitor, setShowVisitor] = useState(false);
    const [homeInfoObj, setHomeInfo] = useState({
        home_id: "", home_code: "", home_address: ""
    })
    //----------------Form load
    useEffect(() => {
        setShowVisitor(false)
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            setShowLoading(true);
            document.body.style.cursor = "wait";
            EstampGetByHomeController({ authStore })
                .then((res) => {
                    if (res.result) {
                        if (res.result.length > 0) setHomeObj(res.result);
                        else {
                            setHomeObj([]);
                        }
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
    //--------------Click View
    function onViewClick(event) {
        const home_id = event.target.getAttribute("home_id");
        const home_code = event.target.getAttribute("home_code");
        const home_address = event.target.getAttribute("home_address");
        setHomeInfo({
            home_id, home_code, home_address
        })
        setShowVisitor(true);
    }
    let showVisitorInfo = null;
    if (showVisitor) {
        showVisitorInfo = <EstampGetAll
            homeInfoObj={homeInfoObj}
            setShowVisitor={setShowVisitor}
            setShowLoading={setShowLoading}
        />
    } else {
        showVisitorInfo = <CCard>
            <CCardHeader>
                Home Table
                </CCardHeader>
            <CCardBody>
                <CDataTable
                    className="tb-modal-td"
                    items={homeObj}
                    fields={fields}
                    striped
                    itemsPerPage={10}
                    pagination
                    scopedSlots={{
                        'บ้านเลขที่': (item) => (
                            <td>
                                <span>{item.home_address}</span>
                            </td>
                        )
                        , 'เลือกบ้าน':
                            (item) => (
                                <td>
                                    <CButton
                                        home_id={item.home_id}
                                        home_code={item.home_code}
                                        home_address={item.home_address}
                                        onClick={onViewClick}
                                        className="btn-class"
                                        color="primary">
                                        {/* <CIcon
                                        visitor_record_id={item.visitor_record_id}
                                        visitor_record_code={item.visitor_record_code}
                                        name="cil-star"
                                        color="info" /> */}
                                        <span
                                            home_id={item.home_id}
                                            home_code={item.home_code}
                                            home_address={item.home_address}
                                            className="btn-icon">เลือกบ้าน</span></CButton>
                                </td>
                            )
                    }
                    }
                />
            </CCardBody>
        </CCard>
    }
    //--------------------------------------------------------------
    return (
        <div>
            {showVisitorInfo}
        </div>
    )
}

export default EstampGetByHome;