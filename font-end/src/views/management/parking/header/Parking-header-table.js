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
import '../main/Parking-main.css'
import './Parking-header.css'
import store, { selectCPH } from '../../../../store'
import { fieldsHeader } from '../data/parking-data'
import { getBadgeCph, getTextStatusCph } from '../data/parking-data'

function ParkingHeaderTable(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const cpm_id = authStore.cpm_id;
    //------------------Props
    const { setShowLoading
        , setShowMasterForm
        , setShowHeaderForm
        , setShowMasterEditForm
        , parkingHeaderObj
        , setShowModalAdd
        , setShowParkingHeaderTable
        , setShowParkingHeaderInfo
    } = props;

    //---------------Show edit form
    function onViewClick(event) {
        const cph_id = event.target.getAttribute("cph_id");
        store.dispatch(selectCPH({ cph_id }));
        setShowParkingHeaderTable(false);
        setShowParkingHeaderInfo(true);
    }
    //----------------On Back Click
    function onBackClick(event) {
        setShowHeaderForm(false);
        setShowParkingHeaderTable(false);
        setShowMasterEditForm(true);
    }

    //---------------------------------------------
    return (
        <CCol xs="12" lg="12">
            <div className="btn-addparcel">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowModalAdd(true)}
                ><span>สร้าง Zone Rate</span></CButton>
            </div>
            <br></br>
            <CCard>
                <CCardHeader className="card-header-cph">
                    Parking Zone Rate Table
                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        // onRowClick={onEditRowClick}
                        className="tb-modal-td"
                        items={parkingHeaderObj}
                        fields={fieldsHeader}
                        striped
                        itemsPerPage={10}
                        pagination
                        scopedSlots={{
                            'ประเภทรถ': (item) => (
                                <td>
                                    <span>{item.cartype_name_th}</span>
                                </td>
                            ), 'ชื่อ Zone Rate': (item) => (
                                <td>
                                    <span>{item.cph_name_th}</span>
                                </td>
                            ), 'Start zone': (item) => (
                                <td>
                                    <span>{item.time_zone_start}</span>
                                </td>
                            ), 'Stop zone': (item) => (
                                <td>
                                    <span>{item.time_zone_stop}</span>
                                </td>
                            ), 'สถานะ': (item) => (
                                <td>
                                    <CBadge color={getBadgeCph(item.priority_no)}>
                                        {getTextStatusCph(item.priority_no)}
                                    </CBadge>
                                </td>
                            ), 'จัดการ':
                                (item) => (
                                    <td>
                                        <CButton
                                            cph_id={item.cph_id}
                                            cph_code={item.cph_code}
                                            onClick={onViewClick}
                                            className="btn-class btn-edit"
                                            color="primary">
                                            {/* <CIcon
                                                cpm_id={item.cpm_id}
                                                cpm_code={item.cpm_code}
                                                name="cil-magnifying-glass"
                                                color="info" /> */}
                                            <span
                                                cph_id={item.cph_id}
                                                cph_code={item.cph_code}
                                                className="btn-icon">เลือก</span></CButton>
                                    </td>
                                )
                        }
                        }
                    />
                </CCardBody>
            </CCard>
            <CButton
                onClick={onBackClick}
                className="btn-class btn-back"
                color="danger">
                <span
                    className="btn-icon">ย้อนกลับ</span></CButton>
        </CCol>
    )
}

export default ParkingHeaderTable;