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
function EstampMain() {
    const history = useHistory();
    const authStore = useSelector(state => state)

    //--------------Form load

    //--------------Reset form


    //---------------------------------------------
    return (
        <CCard>
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
                                    <EstampGetAll/>
                                </CTabPane>
                                <CTabPane className="tab-form">
                                    <EstampGetByHome/>
                                </CTabPane>
                            </CTabContent>
                        </CTabs>
                    
            </CCardBody>
        </CCard>)
}

export default EstampMain;