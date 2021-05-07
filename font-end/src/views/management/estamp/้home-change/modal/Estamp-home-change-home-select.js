import '../main/Estamp-home-change.css'
import { fieldsHome} from '../data/estamp-home-change-data'
import {
    CModalBody,
    CFormGroup,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CDataTable,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import { getHomeAllNotDisable, changeHome } from './Estamp-home-change-modal-controller'
import InputEnable from '../../../component/input/InputEnable'
import store, { disAuthenticationLogin } from '../../../../../store'

export default function EstampHomeChangeSelectHome(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    const { closeModal, estampInfo, setShowLoading } = props;
    //------------------State
    const [homeInfo, setHomeInfo] = useState(null);
    const [addressSearch, setAddressSearch] = useState('');
    //------------------Form Load
    useEffect(() => {
        setShowLoading(true);
        refeshForm();
    }, [])
    //------------------Refesh Form
    function refeshForm() {
        const searchObj = {
            home_address: addressSearch ? addressSearch : ""
        }
        let isNotAuth;
        document.body.style.cursor = 'wait';
        getHomeAllNotDisable({ authStore, searchObj })
            .then((res) => {
                if (res.result) {
                    setHomeInfo(res.result);
                } else if (res.statusCode === 401) {
                    isNotAuth = res.error;
                } else {
                    setHomeInfo(null)
                    swal("Warning!", res.error, "warning");
                }
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
    //------------------On Search Click
    function onSearchClick(event) {
        refeshForm();
    }
    //------------------On Select home change
    function onSelectHomeChangeClick(event) {
        const home_id = event.target.getAttribute("home_id")
        swal({
            title: "Are you sure?",
            text: "ต้องการเปลี่ยนบ้านให้ผู้มาเยือนหรือไม่",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await saveChangeHome(home_id);
                } else { }
            });
    }
    async function saveChangeHome(home_id) {
        const selectedObj = {
            home_id
            , visitor_record_id: estampInfo.visitor_record_id
        }
        let isNotAuth;
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        changeHome({ authStore, selectedObj })
            .then(res => {
                if (res.error) {
                    if (res.statusCode === 401) {
                        isNotAuth = res.error
                    }else{
                        swal("Warning!", res.error, "warning");
                        setShowLoading(false);
                    }
                }  else {
                    swal("Success", "เปลี่ยนบ้านให้ผู้มาเยือนเรียบร้อย", "success")
                        .then((value) => {
                            closeModal();
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                history.push("/page500");
                closeModal();
            })
            .finally((value) => {
                document.body.style.cursor = "default";
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            });
    }
    //-------------------Show loading spiner

    //-------------------------------------------
    return (
        <div>
            <CModalBody>
                <CFormGroup>
                    <CCard>
                        <CCardHeader>เลือกบ้านที่ต้องการเปลี่ยน</CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12" sm="6" md="6"><InputEnable
                                    title="บ้านเลขที่"
                                    placeholder="Enter home address"
                                    text={addressSearch}
                                    setText={setAddressSearch}
                                    maxLenght="50"
                                /></CCol>
                            </CRow>
                            <div className="head">
                                <CButton
                                    className="btn-class btn-head"
                                    color="info"
                                    onClick={onSearchClick}
                                >
                                    <CIcon
                                        name="cil-magnifying-glass"
                                        color="info" />
                                    <span className="span-head">ค้นหา</span>
                                </CButton>
                            </div>
                            <br></br>
                            <CDataTable
                                // onRowClick={onEditRowClick}
                                className="tb-modal-td"
                                items={homeInfo}
                                fields={fieldsHome}
                                striped
                                itemsPerPage={5}
                                pagination
                                scopedSlots={{
                                    'บ้านเลขที่': (item) => (
                                        <td>
                                            <span>
                                                {item.home_address}
                                            </span>
                                        </td>
                                    )
                                    , 'เลือกบ้าน':
                                        (item) => (
                                            <td>
                                                <CButton
                                                    home_id={item.home_id}
                                                    onClick={onSelectHomeChangeClick}
                                                    className="btn-class"
                                                    color="success">
                                                    <CIcon
                                                        home_id={item.home_id}
                                                        name="cil-fullscreen-exit"
                                                        color="danger" />
                                                    <span
                                                        home_id={item.home_id}
                                                        className="btn-icon">เลือกบ้าน</span></CButton>
                                            </td>
                                        )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div>
                </div>
                <div className="modal-footer-item">
                    {/* <CButton className="btn-modal-footer" color="primary" onClick={onChangeHomeClick}>
                        <CIcon
                            name="cil-fullscreen-exit"
                            color="info" />
                        <span className="btn-icon-footer">เปลี่ยนบ้านให้ผู้มาเยือน</span>
                    </CButton> */}
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </div>
    );
}