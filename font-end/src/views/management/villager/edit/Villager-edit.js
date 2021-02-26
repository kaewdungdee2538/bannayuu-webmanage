import { useState } from 'react'
import './Villager-edit.css'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CBadge
} from '@coreui/react'
import VillagerInfoModal from '../info/Villager-info-modal'
import VillagerAddModal from '../add/Villager-add'
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
    { home_id: 0, address: '123', villager: 'John Doe', createdate: '2018/01/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 1, address: '123', villager: 'Samppa Nori', createdate: '2018/01/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 2, address: '123', villager: 'Estavan Lykos', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Active' },
    { home_id: 3, address: '123', villager: 'Estavan Lykos', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
    { home_id: 4, address: '123', villager: 'Estavan Lykos', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
    { home_id: 5, address: '123', villager: 'Estavan Lykos', createdate: '2018/02/01', updatedate: '2018/01/02', status: 'Inactive' },
]

const fields = ['villager', 'createdate', 'updatedate', 'status', 'event']


const CoreUILineHomeEdit = (props) => {
    const [selectedRow, setSelectedRow] = useState({
        selected: false, home_id: '', address: '', createdate: '', updatedate: ''
    });

   
    let selectedrow = null;
    if (!!selectedRow) {
        selectedrow = <VillagerInfoModal selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
    }
    function onEditRowClick(event) {
        setSelectedRow({ ...event, selected: true })
    }
    //------------------------------
    const [showCreate,setShowCreate] = useState(false);
    let showCreateModal = null;
    if(!!showCreate){
        showCreateModal = <VillagerAddModal showCreate={showCreate} setShowCreate={setShowCreate}/>
    }

    return (
        <CCard>
            {selectedrow}
            {showCreateModal}
            <CCardHeader className="villager-head">
                ลูกบ้าน
            </CCardHeader >
            <div className="btn-addhome">
                <CButton  className="btn-class" color="success" onClick={()=>setShowCreate(true)}>เพิ่มลูกบ้าน</CButton>
            </div>
            <CCardBody>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader className="villager-head">
                            Villager Table
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
                                    'status':
                                        (item) => (
                                            <td>
                                                <CBadge className="status" color={getBadge(item.status)}>
                                                    {item.status}
                                                </CBadge>
                                            </td>
                                        )
                                    , 'event':
                                        (item) => (
                                            <td>
                                                <CButton className="btn-class" color="primary">แก้ไข</CButton>
                                            </td>
                                        )
                                }
                                }
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CCardBody>
            {/* {selectedrow} */}
        </CCard>
    )
}

export default CoreUILineHomeEdit