import './Home-edit-modal.css'
import { useState, useEffect } from 'react'
import swal from 'sweetalert';
import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormGroup,
    CSwitch
} from '@coreui/react'
import HomeAddInput from '../component/Home-add-input'
import HomeAddGetCode from '../component/Home-add-gen-code'
import { getHomeInfoByID, editHomeInfoByID } from './home-edit-modal-func'
import { useHistory } from 'react-router-dom'
import { convertTZ } from '../../../../utils'
import store, { disAuthenticationLogin } from '../../../../store'

function HomeEditModal({ selectedRow, setSelectedRow, authStore, setRefeshForm, setShowLoading }) {
    const history = useHistory();
    // const [modal, setModal] = useState(true)
    // const [large, setLarge] = useState(selectedRow)
    // const [small, setSmall] = useState(false)
    // const [primary, setPrimary] = useState(false)
    // const [success, setSuccess] = useState(false)
    // const [warning, setWarning] = useState(false)
    // const [danger, setDanger] = useState(false)
    // const [info, setInfo] = useState(false)
    const [check, setCheck] = useState(true);
    const { selected, home_id } = selectedRow
    const [homeCode, setHomeCode] = useState('');
    const [addressText, setAddressText] = useState('');
    const [remarkText, setRemarkText] = useState('');
    // const [createDate, setCreateDate] = useState('');
    // const [createBy, setCreateBy] = useState('');
    // const [updateDate, setUpdateDate] = useState('');
    // const [updateBy, setUpdateBy] = useState('');
    const [companyName, setCompanyName] = useState('')
    //----------------On Load
    useEffect(() => {
        if (selected) {
            let isNotAuth;
            setShowLoading(true)
            document.body.style.cursor = 'wait';
            getHomeInfoByID({ home_id, authStore })
                .then(res => {
                    if (res.error) {
                        if (res.statusCode === 401) {
                            isNotAuth = res.error;
                        } else
                            swal({
                                title: "Waring.",
                                text: res.message,
                                icon: "warning",
                                button: "OK",
                            });
                        closeModal();
                    } else {

                        const result = res.result[0]
                        const home_code = !result.home_code ? '' : result.home_code
                        const home_address = !result.home_address ? '' : result.home_address
                        const home_remark = !result.home_remark ? '' : result.home_remark
                        // const create_date = !result.create_date ? '' : convertTZ(result.create_date).toString()
                        // const create_by = !result.create_by ? '' : result.create_by
                        // const update_date = !result.update_date ? '' : convertTZ(result.update_date)
                        // const update_by = !result.update_by ? '' : result.update_by
                        const company_name = !result.company_name ? '' : result.company_name
                        const status = result.status === 'active' ? true : false;
                        setHomeCode(home_code)
                        setAddressText(home_address)
                        setRemarkText(home_remark)
                        // setCreateDate(create_date)
                        // setCreateBy(create_by)
                        // setUpdateDate(update_date)
                        // setUpdateBy(update_by)
                        setCompanyName(company_name)
                        setCheck(status)
                    }
                }).catch(err => {
                    console.log(err)
                    history.push('/page500')
                }).finally(value => {
                    document.body.style.cursor = 'default';
                    setShowLoading(false)
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                })
        }

    }, [selectedRow]);

    //------------------------Close Modal
    function closeModal(event) {
        setSelectedRow({ ...selectedRow, selected: false })
        setAddressText('');
    }
    //------------------------Edit
    function editHomeModal() {
        let isNotAuth;
        setShowLoading(true)
        document.body.style.cursor = 'wait';
        const home_obj = {
            home_id
            , home_code: homeCode
            , home_address: addressText
            , home_remark: remarkText
            , home_enable: check
        }
        editHomeInfoByID({ home_obj, authStore })
            .then(res => {
                if (res.error) {
                    if (res.statusCode === 401) {
                        isNotAuth = res.error;
                    } else swal({
                        title: "Waring.",
                        text: res.message,
                        icon: "warning",
                        button: "OK",
                    });
                    setShowLoading(false)
                } else {
                    swal({
                        title: "Success.",
                        text: "แก้ไขบ้านเลขที่เรียบร้อย",
                        icon: "success",
                        button: "OK",
                    });
                    closeModal();
                    setRefeshForm(true);
                }
            }).catch(err => {
                console.log(err)
                history.push('/page500')
            }).finally(value => {
                document.body.style.cursor = 'default';
                if (isNotAuth) {
                    swal("Warning!", isNotAuth, "warning");
                    history.push("/");
                    //clear state global at store 
                    store.dispatch(disAuthenticationLogin());
                }
            })

    }
    //--------------
    function onCheckBoxChange(event) {
        if (!event.target.checked) {
            swal({
                title: "ปิดสถานะ!",
                text: "ต้องการปิดสถานะบ้านหลังนี้หรือไม่!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        setCheck(false)
                    } else {

                    }
                });
        } else {
            setCheck(true)
        }
    }
    return (
        <CModal
            show={selected}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="primary"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขข้อมูลบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <HomeAddGetCode
                        title="ชื่อโครงการ"
                        text={companyName}
                    />
                    <HomeAddGetCode
                        title="Home code"
                        text={homeCode}
                    />
                    <HomeAddInput
                        placeholder="Enter home address"
                        title="บ้านเลขที่"
                        text={addressText}
                        setText={setAddressText}
                        maxLenght="30"
                    />
                    <HomeAddInput
                        placeholder="Enter remark"
                        title="หมายเหตุ"
                        text={remarkText}
                        setText={setRemarkText}
                        maxLenght="255"
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter className="modal-footer">
                <div className="modal-footer-item">
                    <CSwitch
                        className={'mx-2'}
                        shape={'pill'}
                        color={'info'}
                        labelOn={'เปิด'}
                        labelOff={'ปิด'}
                        checked={check}
                        onChange={onCheckBoxChange}
                    />
                    <span>สถานะการใช้งาน</span>
                </div>
                <div className="modal-footer-item modal-footer-item-sub">
                    <CButton className="btn-modal-footer" color="primary" onClick={editHomeModal}>บันทึก</CButton>
                    <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
                </div>
            </CModalFooter>
        </CModal>
    );
}

export default HomeEditModal;