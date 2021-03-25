export const getBadge = status => {
    switch (status) {
        case 'N': return 'warning'
        // case 'send_parcel': return 'info'
        case 'Y': return 'success'
        default: return 'danger'
    }
}
export const getStatus = status => {
    switch (status) {
        case 'N': return 'รอการรับเรื่อง'
        // case 'send_parcel': return 'ส่งพัสดุให้ลูกบ้านแล้ว'
        case 'Y': return 'รับเรื่องเรียบร้อยแล้ว'
        default: return 'ยกเลิกรายการ'
    }
}
export const fields = ['รับเรื่อง', 'ที่อยู่', 'รายละเอียด', 'วันที่แจ้ง', 'สถานะ',]
