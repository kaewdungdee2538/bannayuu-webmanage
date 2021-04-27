import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom'
import './Home-add.css'
import { useSelector } from 'react-redux'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
} from '@coreui/react'
import HomeAddInput from '../component/Home-add-input'
import HomeAddGetCode from '../component/Home-add-gen-code'
import addHomeInfo from './Home-add-controller'
import store, { disAuthenticationLogin } from '../../../../store'

const CoreUIHomeAdd = ({ showCreateAdd, setShowCreateAdd, setRefeshForm, setShowLoading }) => {

    const history = useHistory();
    const authStore = useSelector(state => state)
    const [homeCode, setHomeCode] = useState('');
    const [address, setAddress] = useState('');
    const [remark, setRemark] = useState('');


    function closeModal(event) {
        setAddress('');
        setShowCreateAdd(false);
    }

    function addHomeModal() {
        document.body.style.cursor = 'wait';
        setShowLoading(true);
        const values = {
            authStore
            , home_address: address
            , home_remark: remark
        }
        let isNotAuth;
        addHomeInfo(values).then(res => {
            if (res.error) {
                if (res.statusCode === 401) {
                    isNotAuth = res.error;
                } else swal({
                    title: "Warning.",
                    text: res.message,
                    icon: "warning",
                    button: "OK",
                });
                setShowLoading(false);
            } else {
                swal({
                    title: "Success.",
                    text: "เพิ่มบ้านเลขที่เรียบร้อย",
                    icon: "success",
                    button: "OK",
                });
                setRefeshForm(true)
                closeModal();
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


    return (
        <CModal
            show={showCreateAdd}
            onClose={closeModal}
            closeOnBackdrop={false}
            borderColor="success"
            size="lg"
        >
            <CModalHeader closeButton className="modal-header-add">
                <CModalTitle>สร้างข้อมูลบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <HomeAddGetCode
                        title="Home code"
                        text={homeCode}
                        setText={setHomeCode}
                    />
                    <HomeAddInput
                        title="บ้านเลขที่"
                        placeholder="Enter home address"
                        text={address}
                        setText={setAddress}
                        maxLenght="30"
                    />
                    <HomeAddInput
                        title="หมายเหตุ"
                        placeholder="Enter remark"
                        text={remark}
                        setText={setRemark}
                        maxLenght="255"
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton className="btn-modal-footer" color="success" onClick={addHomeModal}>เพิ่มข้อมูล</CButton>
                <CButton className="btn-modal-footer" color="warning" onClick={closeModal}>ยกเลิก</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default CoreUIHomeAdd