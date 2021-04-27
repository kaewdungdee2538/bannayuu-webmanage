export const fields = ['แก้ไข', 'บ้านเลขที่', 'ช่วงเวลาที่เรียกเก็บ','รายการค่าใช้จ่าย', 'จำนวนเงิน']
export const getBadge = status => {
    switch (status) {
        case 'pay': return 'success'
        case 'not': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}