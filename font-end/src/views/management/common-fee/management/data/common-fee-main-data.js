export const fields = ['แก้ไข', 'บ้านเลขที่', 'จากวันที่', 'ถึงวันที่', 'ค่าส่วนกลาง']
export const getBadge = status => {
    switch (status) {
        case 'pay': return 'success'
        case 'not': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}