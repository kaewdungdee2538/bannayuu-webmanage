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
    CLabel,
    CInput
} from '@coreui/react'
import HomeAddInput from '../component/Home-add-input'
import HomeAddGetCode from '../component/Home-add-gen-code'
import { getHomeInfoByID, editHomeInfoByID } from './home-edit-modal-func'
import { useHistory } from 'react-router-dom'
import { convertTZ } from '../../../../utils'
function HomeEditModal({ selectedRow, setSelectedRow, authStore ,setRefeshForm}) {
    const history = useHistory();
    // const [modal, setModal] = useState(true)
    // const [large, setLarge] = useState(selectedRow)
    // const [small, setSmall] = useState(false)
    // const [primary, setPrimary] = useState(false)
    // const [success, setSuccess] = useState(false)
    // const [warning, setWarning] = useState(false)
    // const [danger, setDanger] = useState(false)
    // const [info, setInfo] = useState(false)
    const { selected, home_id } = selectedRow
    const [homeCode, setHomeCode] = useState('');
    const [addressText, setAddressText] = useState('');
    const [remarkText, setRemarkText] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [createBy, setCreateBy] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [updateBy, setUpdateBy] = useState('');
    const [companyName, setCompanyName] = useState('')
    //----------------On Load
    useEffect(() => {
        if (selected) {
            document.body.style.cursor = 'wait';
            getHomeInfoByID({ home_id, authStore })
                .then(res => {
                    if (res.error) {
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
                        const create_date = !result.create_date ? '' : convertTZ(result.create_date).toString()
                        const create_by = !result.create_by ? '' : result.create_by
                        const update_date = !result.update_date ? '' : convertTZ(result.update_date)
                        const update_by = !result.update_by ? '' : result.update_by
                        const company_name = !result.company_name ? '' : result.company_name
                        setHomeCode(home_code)
                        setAddressText(home_address)
                        setRemarkText(home_remark)
                        setCreateDate(create_date)
                        setCreateBy(create_by)
                        setUpdateDate(update_date)
                        setUpdateBy(update_by)
                        setCompanyName(company_name)
                    }
                }).catch(err => {
                    console.log(err)
                    history.push('/page404')
                }).finally(value => {
                    document.body.style.cursor = 'default';
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
        document.body.style.cursor = 'wait';
        const home_obj = {
            home_id
            , home_code: homeCode
            , home_address: addressText
            , home_remark: remarkText
        }
        editHomeInfoByID({ home_obj, authStore })
            .then(res => {
                if (res.error)
                    swal({
                        title: "Waring.",
                        text: res.message,
                        icon: "warning",
                        button: "OK",
                    });
                else {
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
                history.push('/page404')
            }).finally(value => {
                document.body.style.cursor = 'default';
            })

    }
    return (
        <CModal
            show={selected}
            onClose={closeModal}
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-edit">
                <CModalTitle>แก้ไขข้อมูลบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
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
                    <HomeAddGetCode
                        title="ชื่อหมู่บ้าน"
                        text={companyName}
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton className="btn-modal-footer" color="secondary" onClick={closeModal}>Cancel</CButton>
                <CButton className="btn-modal-footer" color="primary" onClick={editHomeModal}>แก้ไข</CButton>
            </CModalFooter>
        </CModal>
    );
}

export default HomeEditModal;