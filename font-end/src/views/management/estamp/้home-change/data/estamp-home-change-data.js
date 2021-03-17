export const fields = ['ประทับตรา', 'ทะเบียนรถ', 'ชื่อ-สกุล', 'เวลาเข้า', 'estamp']
export const fieldsHome = ['บ้านเลขที่', 'เลือกบ้าน']
export const getBadge = status => {
    switch (status) {
        case 'YES': return 'success'
        case 'NOT': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
export const getTextStatus = status => {
    switch (status) {
        case 'Y': return 'YES'
        case 'N': return 'NOT'
        default: return '-'
    }
}