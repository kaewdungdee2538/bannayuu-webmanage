export const fields = ['แสดง', 'บ้านเลขที่', 'จากวันที่', 'ถึงวันที่', 'ค่าส่วนกลาง','สถานะ']
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