export const fields = ['จัดการ','ประเภทรถ', 'ชื่อ Master Rate','ประเภทวัน','เริ่ม','ถึง']
export const getBadge = status => {
    switch (status) {
        case 'Y': return 'success'
        case 'N': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}

export const getTextStatus = status => {
    switch (status) {
        case 'Y': return 'ตรวจสอบเรียบร้อยแล้ว'
        case 'N': return 'ยังไม่ได้ตรวจสอบ'
        case 'pending': return 'warning'
        case 'cancel': return 'ยกเลิกรายการเรียกเก็บ'
        default: return 'อื่นๆ'
    }
}