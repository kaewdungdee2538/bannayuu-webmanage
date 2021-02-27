import './Villager-info-modal.css'
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
import store, { selectHome,unSelectHome } from "../../../../store";
import { useSelector } from "react-redux";
function VillagerInfoModal({ selectedRow, setSelectedRow }) {

    // const [modal, setModal] = useState(true)
    // const [large, setLarge] = useState(selectedRow)
    // const [small, setSmall] = useState(false)
    // const [primary, setPrimary] = useState(false)
    // const [success, setSuccess] = useState(false)
    // const [warning, setWarning] = useState(false)
    // const [danger, setDanger] = useState(false)
    // const [info, setInfo] = useState(false)
    const { selected, home_id, address, createdate, updatedate } = selectedRow

    function addressOnChange(event) {
        setSelectedRow({ ...selectedRow, address: event.target.value })
    }

    function closeModal(event) {
        setSelectedRow({ ...selectedRow, selected: false })
    }

    function editHomeModal() {
        swal({
            title: "Success.",
            text: "แก้ไขบ้านเลขที่เรียบร้อย",
            icon: "success",
            button: "OK",
        });
        closeModal();
    }

    function deleteHomeModal() {
        swal({
            title: "Are you sure?",
            text: "คุณต้องการจำลบบ้าน หรือไม่!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("ลบบ้านเรียบร้อย", {
                        icon: "success",
                    });
                    closeModal();
                } else {
                  
                }
            });
    }

    return (
        <CModal
            show={selected}
            onClose={closeModal}
            size="lg"
        >
            <CModalHeader closeButton className="modal-villager-head-edit">
                <CModalTitle>แก้ไขข้อมูลบ้าน</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel htmlFor="homeaddress">บ้านเลขที่</CLabel>
                    <CInput
                        className="modal-input"
                        id="home-address"
                        placeholder="Enter home address"
                        value={address}
                        onChange={addressOnChange}
                    />
                     <CLabel htmlFor="homeaddress">บ้านเลขที่</CLabel>
                    <CInput
                        className="modal-input"
                        id="home-address"
                        placeholder="Enter home address"
                        value={address}
                        onChange={addressOnChange}
                    />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton className="btn-modal-footer" color="danger" onClick={deleteHomeModal}>ลบ</CButton>
                <CButton className="btn-modal-footer" color="primary" onClick={editHomeModal}>แก้ไข</CButton>
                <CButton className="btn-modal-footer" color="secondary" onClick={closeModal}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    );
}

export default VillagerInfoModal;