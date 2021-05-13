export const fields = ['แก้ไข', 'รหัสบัตร', 'เลขหน้าบัตร', 'สถานะ']
export const getBadge = status => {
    switch (status) {
        case 'NOT': return 'success'
        case 'OTHER': return 'secondary'
        case 'USE': return 'warning'
        case 'PROBLEM': return 'danger'
        default: return 'primary'
    }
}

export const getTextStatus = status => {
    switch (status) {
        case 'USE': return 'กำลังใช้งาน'
        case 'NOT': return 'พร้อมใช้งาน'
        case 'PROBLEM': return 'บัตรหาย / ชำรุด'
        default: return '-'
    }
}