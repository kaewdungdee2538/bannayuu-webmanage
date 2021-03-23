import {
    CModal,
    CModalBody,
} from '@coreui/react'
import './LoadingModal.css'
export default function LoadingModal(props) {
    const { setShowLoading, showLoading } = props;
    return (
        <div id="myModal" key={Date.now}
            className="modal-loading"
            style={{ display: showLoading ? 'block' : 'none' }}
        >
            <div className="modal-loading-content">
                <div className="spinner-border text-danger"></div>
            </div>
        </div>
    );
}