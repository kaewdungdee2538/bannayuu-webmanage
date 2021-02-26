import React,{useState} from 'react'
import './Villager-add.css'
import swal from 'sweetalert';
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormGroup,
    CInput,
    CLabel,
    CModalFooter,
} from '@coreui/react'

function VillagerAddModal({showCreate,setShowCreate}) {

    function closeModal(event){
        setShowCreate(false);
    }

    //------------------------------
    const [address,setAddress] = useState('');

    //-------------------------------
    function addHomeModal(event){
        swal({
            title: "Success.",
            text: "แก้ไขบ้านเลขที่เรียบร้อย",
            icon: "success",
            button: "OK",
        });
        closeModal();
    }
    return (
        <CModal
        show={showCreate}
        onClose={closeModal}
        size="lg"
    >
        <CModalHeader closeButton className="modal-villager-header-add">
            <CModalTitle>เพิ่มข้อมูลลูกบ้าน</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormGroup>
                <CLabel htmlFor="homeaddress">บ้านเลขที่</CLabel>
                <CInput
                    className="modal-input"
                    id="home-address"
                    placeholder="Enter home address"
                    value={address}
                    onChange={(event)=>setAddress(event.target.value)}
                />
            </CFormGroup>
        </CModalBody>
        <CModalFooter>
            <CButton className="btn-modal-footer" color="success" onClick={addHomeModal}>เพิ่มข้อมูล</CButton>
            <CButton className="btn-modal-footer" color="secondary" onClick={closeModal}>ยกเลิก</CButton>
        </CModalFooter>
    </CModal>
    )
}

export default VillagerAddModal;