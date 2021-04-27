export const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'inactive': return 'secondary'
        case 'pending': return 'warning'
        case 'banned': return 'danger'
        default: return 'primary'
    }
}
export const fields = ['แก้ไข', 'ทะเบียนรถ', 'สถานะ']
export const fieldsHome = ['บ้านเลขที่', 'เลือกบ้าน']