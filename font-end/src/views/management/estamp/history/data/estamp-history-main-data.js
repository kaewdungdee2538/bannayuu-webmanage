export const fields = ['แสดง', 'ทะเบียนรถ', 'ชื่อ','บ้านที่มาติดต่อ', 'เวลาประทับตรา', ]
export const getBadge = status => {
    switch (status) {
        case 'Y': return 'success'
        case 'N': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}

export const getTextStatus = status => {
    switch (status) {
        case 'Y': return 'ประทับตราแล้ว'
        case 'N': return 'ยังไม่ได้ประทับตรา'
        default: return '-'
    }
}