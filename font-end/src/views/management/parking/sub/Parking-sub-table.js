import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CRow,
    CLabel,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import swal from 'sweetalert';
import '../main/Parking-main.css'
import './Parking-sub-table.css'
import store, { disAuthenticationLogin, selectCPS } from '../../../../store'
import { fieldsSub } from '../data/parking-data'
import { getParkingSubAllByCPHID } from './Parking-sub-table-controller'
import ParkingSubAddModal from './add-modal/Parking-sub-table-add-modal'
import ParkingSubEditModal from './edit-modal/Parking-sub-edit-modal'

function ParkingSubTable(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cph_id = authStore.cph_id;
    //------------------Props
    const { setShowLoading } = props;

    //---------------State
    const [resfeshForm, setRefeshForm] = useState(false);
    const [showModalAddSub, setShowModalAddSub] = useState(false);
    const [showModalEditSub, setShowModalEditSub] = useState(false);
    const [parkingSubObjList, setParkingSubObjList] = useState([]);

    //--------------Form load
    useEffect(() => {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            setShowLoading(true);
            refeshForm();
        }
    }, []);
    //-------------------------Refesh form
    function refeshForm() {
        let isNotAuth;
        document.body.style.cursor = "wait";
        const searchObj = {
            cph_id
        }
        getParkingSubAllByCPHID({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    if (res.result.length > 0) {
                        const result = res.result;
                        const resultObj = result.map(item => {
                            const valuesObj = {
                                cps_id: item.cps_id
                                , cps_code: item.cps_code
                                , cph_id: item.cph_id
                                , start_interval: item.cps_start_interval
                                , stop_interval: item.cps_stop_interval
                                , amount_value: item.cps_amount_value
                                , status: item.cps_status
                                , company_name: item.company_name
                            }
                            return valuesObj;
                        })
                        setParkingSubObjList(resultObj);
                    } else setParkingSubObjList([]);
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

    //---------------Show edit form
    function onViewClick(event) {
        const cps_id = event.target.getAttribute("cps_id");
        store.dispatch(selectCPS({ cps_id }));
        setShowModalEditSub(true);
    }
    //-----------------Show add sub modal
    let parkingSubAddModalElem = null;
    if (showModalAddSub) {
        parkingSubAddModalElem = <ParkingSubAddModal
            showModalAdd={showModalAddSub}
            setShowModalAdd={setShowModalAddSub}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    } else parkingSubAddModalElem = null;
    //------------------Show edit sub modal
    let parkingSubEditModalElem = null;
    if (showModalEditSub) {
        parkingSubEditModalElem = <ParkingSubEditModal
            showModalEdit={showModalEditSub}
            setShowModalEdit={setShowModalEditSub}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    } else parkingSubEditModalElem = null;
    //---------------------------------------------
    return (
        <div>
            {parkingSubAddModalElem}
            {parkingSubEditModalElem}
            <div className="btn-addparcel">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowModalAddSub(true)}
                ><span>สร้างตารางค่าบริการจอดรถ</span></CButton>
            </div>
            <br></br>
            <CCard>
                <CCardHeader className="card-header-cps">
                    Parking Price Table
                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        // onRowClick={onEditRowClick}
                        className="tb-modal-td"
                        items={parkingSubObjList}
                        fields={fieldsSub}
                        striped
                        itemsPerPage={10}
                        pagination
                        scopedSlots={{
                            'เวลาจอดตั้งแต่': (item) => (
                                <td>
                                    <span>{item.start_interval}</span>
                                </td>
                            ), 'เวลาจอดสิ้นสุด': (item) => (
                                <td>
                                    <span>{item.stop_interval}</span>
                                </td>
                            ), 'ค่าบริการ': (item) => (
                                <td>
                                    <span>{item.amount_value}</span>
                                </td>
                            ), 'จัดการ':
                                (item) => (
                                    <td>
                                        <CButton
                                            cps_id={item.cps_id}
                                            cps_code={item.cps_code}
                                            onClick={onViewClick}
                                            className="btn-class btn-edit"
                                            color="primary">
                                            {/* <CIcon
                                                cpm_id={item.cpm_id}
                                                cpm_code={item.cpm_code}
                                                name="cil-magnifying-glass"
                                                color="info" /> */}
                                            <span
                                                cps_id={item.cps_id}
                                                cps_code={item.cps_code}
                                                className="btn-icon">แก้ไข</span></CButton>
                                    </td>
                                )
                        }
                        }
                    />
                </CCardBody>
            </CCard>
        </div>
    )
}

export default ParkingSubTable;