export const fields = ['แสดง', 'บ้านเลขที่', 'วันที่ชำระเงิน','รายการค่าใช้จ่าย', 'จำนวนเงิน','สถานะ']
export const getBadge = status => {
    switch (status) {
        case 'completed': return 'success'
        case 'none': return 'secondary'
        case 'incompleted': return 'warning'
        case 'failed': return 'danger'
        default: return 'primary'
    }
}
