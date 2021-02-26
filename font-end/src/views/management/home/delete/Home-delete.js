import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge
  } from '@coreui/react'
  import usersData from '../../../users/UsersData'
  const getBadge = status => {
    switch (status) {
      case 'Active': return 'success'
      case 'Inactive': return 'secondary'
      case 'Pending': return 'warning'
      case 'Banned': return 'danger'
      default: return 'primary'
    }
  }
 
  const fields = ['name','registered', 'role', 'status']
const CoreUIHomeDelete = () => {
  return (
    <CCard>
      <CCardHeader>
        แก้ไขบ้าน
      </CCardHeader>
      <CCardBody>
      <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>
              Striped Table
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={usersData}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  )

              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CCardBody>
    </CCard>
  )
}

export default CoreUIHomeDelete