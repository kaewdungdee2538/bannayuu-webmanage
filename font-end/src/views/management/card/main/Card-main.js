import './Card-main.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CDataTable,
    CBadge,
} from '@coreui/react'
import swal from 'sweetalert';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import LoadingModal from '../../component/loading/LoadingModal'
import store, { disAuthenticationLogin } from '../../../../store'
import { fields, getBadge, getTextStatus } from '../data/card-data'
import { getCardAll } from './Card-main-controller'
import CardAddModal from '../add/Card-add-modal'
import CardEditModal from '../edit/Card-edit-modal'
import InputEnable from '../../component/input/InputEnable'
function CardMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    //--------------State
    const [cardObj, setCardObj] = useState(null)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedObj, setSelectedObj] = useState({
        card_id: "", card_code: ""
    });
    const [refeshForm, setRefeshForm] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [cardCode, setCardCode] = useState("");
    const [cardName, setCardName] = useState("");
    //---------------Form load
    useEffect(() => {
        setShowLoading(true);
        refeshFormFunc(true);
    }, [])

    //-----------------Refesh Form
    if (refeshForm) {
        refeshFormFunc(true);
        setRefeshForm(false);
    }
    function refeshFormFunc(reset) {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            document.body.style.cursor = "wait";
            const searchObj = {
                card_code: reset ? null : cardCode
                , card_name: reset ? null : cardName
            }
            getCardAll({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result;
                        if (result.length > 0)
                            setCardObj(result);
                        else setCardObj([]);
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
    }
    //-------------------Show loading spiner
    let loadingmodal = null;
    if (showLoading) {
        loadingmodal = <LoadingModal
            setShowLoading={setShowLoading}
            showLoading={showLoading}
        />
    } else loadingmodal = null;
    //-----------------Set Show Modal
    let cardEditModal = null;
    if (showEditModal) {
        cardEditModal = <CardEditModal
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            setRefeshForm={setRefeshForm}
            selectedObj={selectedObj}
            setShowLoading={setShowLoading}
        />
    } else cardEditModal = null;
    //------------------on click show modal
    function onClickShowModal(event) {
        const card_id = event.target.getAttribute("card_id")
        const card_code = event.target.getAttribute("card_code")
        setSelectedObj({ card_id, card_code })
        setShowEditModal(true);
    }

    //------------------set show add modal
    let cardAddModal = null;
    if (showAddModal) {
        cardAddModal = <CardAddModal
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            setRefeshForm={setRefeshForm}
            setShowLoading={setShowLoading}
        />
    }
    //------------------On search click
    function onSearchClick() {
        refeshFormFunc();
    }
    //--------------------------
    return (
        <CCard>
            {loadingmodal}
            {cardEditModal}
            {cardAddModal}
            <CCardHeader className="form-head-card">บัตร RFID</CCardHeader>
            <div className="btn-add">
                <CButton
                    className="btn-head"
                    color="success"
                    onClick={() => setShowAddModal(true)}
                ><span>เพิ่มบัตร RFID</span></CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Card Table
                    </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <InputEnable
                                        title="รหัสบัตร (เลือกกล่องข้อความแล้วทาบบัตร)"
                                        placeholder="Enter card code"
                                        maxLength="30"
                                        text={cardCode}
                                        setText={setCardCode}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12" sm="6" md="6">
                                    <InputEnable
                                        title="เลขหน้าบัตร"
                                        placeholder="Enter card name"
                                        maxLength="30"
                                        text={cardName}
                                        setText={setCardName}
                                    />
                                </CCol>
                            </CRow>
                            <br></br>
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
                                items={cardObj}
                                fields={fields}
                                striped
                                itemsPerPage={10}
                                pagination
                                scopedSlots={{
                                    'แก้ไข':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    card_id={item.card_id}
                                                    card_code={item.card_code}
                                                    onClick={onClickShowModal}
                                                    className="btn-class btn-edit"
                                                    color="primary">
                                                    <CIcon
                                                        card_id={item.card_id}
                                                        card_code={item.card_code}
                                                        name="cil-pencil"
                                                        color="danger" />
                                                    <span
                                                        card_id={item.card_id}
                                                        card_code={item.card_code}
                                                        className="btn-icon">แก้ไข</span></CButton>
                                            </td>
                                        ), 'รหัสบัตร': (item) => (
                                            <td>
                                                <span>
                                                    {item.card_code}
                                                </span>
                                            </td>
                                        ), 'เลขหน้าบัตร': (item) => (
                                            <td>
                                                <span> {item.card_name}</span>
                                            </td>
                                        ), 'สถานะ': (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.status)}>
                                                    {getTextStatus(item.status)}
                                                </CBadge>
                                            </td>
                                        )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>
        </CCard>
    )
}

export default CardMain;