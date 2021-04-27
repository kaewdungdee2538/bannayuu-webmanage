export const fields = ['แสดง', 'บ้านเลขที่', 'ช่วงเวลาที่เรียกเก็บ','รายการค่าใช้จ่าย', 'จำนวนเงิน','สถานะ']
export const getBadge = status => {
    switch (status) {
        case 'pay': return 'success'
        case 'not': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}

export const getTextStatus = status => {
    switch (status) {
        case 'pay': return 'ชำระเงินแล้ว'
        case 'not': return 'ยังไม่ชำระเงิน'
        case 'pending': return 'warning'
        case 'cancel': return 'ยกเลิกรายการเรียกเก็บ'
        default: return 'อื่นๆ'
    }
}