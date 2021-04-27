export const fields = ['ตรวจสอบ', 'บ้านเลขที่', 'วันที่ชำระเงิน','รายการค่าใช้จ่าย', 'จำนวนเงิน','สถานะ']
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