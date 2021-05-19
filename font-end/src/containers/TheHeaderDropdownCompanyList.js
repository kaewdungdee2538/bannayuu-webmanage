import { useState, useEffect } from 'react'
import {

} from '@coreui/react'
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom'
import store, { disAuthenticationLogin, selectNewCompany } from '../store'
import ComboBoxSearchItemNoTitle from '../views/management/component/combobox/ComboBoxSearchItemNoTitle'
import { GetCompanyList } from './function/get-company-list'

const TheHeaderDropdownCompanyList = ({ authStore }) => {
    let history = useHistory();
    const company_id = authStore.company_id ? authStore.company_id : null;
    const company_name = authStore.company_name ? authStore.company_name : null;
    const company_list = authStore.company_list ? authStore.company_list : [];
    //-----------------State
    const [companyListArray, setCompanyListArray] = useState([]);
    const [compantTarget, setCompanyTarget] = useState(
        {
            id: company_id
            , value: company_name
        })
    const [showComboBox, setShowComboBox] = useState(false);
    //---------------Form load
    useEffect(() => {
        refeshFormFunc();
    }, [])
    function refeshFormFunc() {
        if (!authStore.authorization) {
            history.push("/");
        } else {
            let isNotAuth;
            // setShowLoading(true);
            document.body.style.cursor = "wait";
            const searchObj = {
                company_list
            }
            GetCompanyList({ authStore, searchObj })
                .then((res) => {
                    if (res.result) {
                        const result = res.result.map((item) => { return { id: item.company_id, value: item.company_name } });
                        setCompanyListArray(result);
                        setShowComboBox(true);
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
                    // setShowLoading(false);
                    if (isNotAuth) {
                        swal("Warning!", isNotAuth, "warning");
                        history.push("/");
                        //clear state global at store 
                        store.dispatch(disAuthenticationLogin());
                    }
                });
        }
    }
    //-----------------Show combobox when company list more than 1
    let comboBoxCompanyListArrayElem = null;
    if (company_list && showComboBox) {
        if (company_list.length > 1) {
            comboBoxCompanyListArrayElem = <ComboBoxSearchItemNoTitle
                title=""
                text={compantTarget}
                placeholder="Enter company name"
                itemsArray={companyListArray}
                selectText={compantTarget}
                setSelectText={setNewCompanyTarget}
            />
        }
    }
    //-----------------Set Select new company
    function setNewCompanyTarget(item) {
        if(item.id != compantTarget.id){
            swal({
                title: "เปลี่ยนโครงการ/หมู่บ้าน หรือไม่ ?",
                text: `เปลี่ยนเป็น ${item.value} ?`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        newCompanyTarget(item);
                    } else { }
                });
        }
        
    }
    function newCompanyTarget(item){
        setCompanyTarget(item)
        console.log(item);
        store.dispatch(selectNewCompany({
            company_id: item.id,
            company_name: item.value
        }));
        history.go(0);
    }
    //-----------------------------------------
    return (
        <div>
            {comboBoxCompanyListArrayElem}
        </div>
    )
}

export default TheHeaderDropdownCompanyList
