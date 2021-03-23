import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './EstampMain.css'
import CIcon from '@coreui/icons-react'
import swal from 'sweetalert';
import EstampGetAll from '../manage-all/Estamp-get-all'
import EstampGetByHome from '../manage-by-home/Estamp-get-by-home'
import LoadingModal from '../../../component/loading/LoadingModal'
function EstampMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    //-------------------State
    const [showLoading,setShowLoading] = useState(false);
    //-------------------Show loading spiner
  let loadingmodal = null;
  if(showLoading){
      loadingmodal = <LoadingModal
      setShowLoading={setShowLoading}
      showLoading={showLoading}
      />
  }else loadingmodal = null;
    //---------------------------------------------
    return (
        <CCard>
            {loadingmodal}
            <CCardHeader className="form-head-estamp">จัดการประทับตราโครงการ</CCardHeader>
            <CCardBody>
                
                        <CTabs>
                            <CNav variant="tabs" className="tab-head">
                                <CNavItem>
                                    <CNavLink>
                                        ผู้มาเยือนทั้งหมด
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink>
                                        แยกตามที่อยู่
                                    </CNavLink>
                                </CNavItem>
                            </CNav>
                            <CTabContent>
                                <CTabPane className="tab-form">
                                    <EstampGetAll setShowLoading={setShowLoading}/>
                                </CTabPane>
                                <CTabPane className="tab-form">
                                    <EstampGetByHome setShowLoading={setShowLoading}/>
                                </CTabPane>
                            </CTabContent>
                        </CTabs>
                    
            </CCardBody>
        </CCard>)
}

export default EstampMain;