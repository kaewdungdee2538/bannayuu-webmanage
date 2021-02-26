import { useState } from 'react'
import './Villager-home-info.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
} from '@coreui/react';
import {
    useHistory 
} from 'react-router-dom'

const getBadge = status => {
    switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: return 'primary'
    }
}

const usersData = [
    { home_id: 0, address: '111', createdate: '2018/01/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 1, address: '112', createdate: '2018/01/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 2, address: '113', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 3, address: '114', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
    { home_id: 4, address: '115', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
    { home_id: 5, address: '116', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
]

const fields = ['address', 'event']


const VillagerHomeInfo = () => {
    const history = useHistory();

    function onEditRowClick(event) {
        history.push("/villager/edit")
    }

    return (
        <CCard>
            <CCardHeader className="form-main-header">
                บ้าน
            </CCardHeader>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader className="form-section-header">
                            Home Table
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                onRowClick={onEditRowClick}
                                items={usersData}
                                fields={fields}
                                striped
                                itemsPerPage={5}
                                pagination
                                scopedSlots={{
                                    'event':
                                        (item) => (
                                            <td>
                                                <CButton className="btn-class" color="primary">เลือกบ้าน</CButton>
                                            </td>
                                        )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>

        </CCard>
    )
}

export default VillagerHomeInfo