import axios from "axios";
import ApiRoute from "../../../../../apiroute";

export const ComplaintNotApproveModalController = (props) => {
    const { authStore,selectObj } = props;
    const company_id = authStore.company_id;
    const hci_id = selectObj.hci_id;
    const hci_code = selectObj.hci_code;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        hci_id,
        hci_code
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.complaint.get_complaint_by_id_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};

export const ComplaintSaveReceiptModalController = (props) => {
    const { authStore,complaintObject } = props;
    const company_id = authStore.company_id;
    const hci_id = complaintObject.hci_id;
    const hci_remark = complaintObject.hci_remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        hci_id,
        hci_remark
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.complaint.save_complaint_to_receipt_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};

export const ComplaintSaveRejectModalController = (props) => {
    const { authStore,complaintObject } = props;
    const company_id = authStore.company_id;
    const hci_id = complaintObject.hci_id;
    const hci_remark = complaintObject.hci_remark;
    const config = {
        headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
        company_id,
        hci_id,
        hci_remark
    };
    const url = `${ApiRoute.main_url}${ApiRoute.port}${ApiRoute.complaint.save_complaint_to_reject_url}`
    return axios.post(url, bodyParameters, config)
        .then((res) => {
            return res.data.response;
        }).catch(err => {
            console.log(err)
        });
};

