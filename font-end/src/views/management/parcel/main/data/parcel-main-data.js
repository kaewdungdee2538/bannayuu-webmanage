export const getBadge = status => {
    switch (status) {
        case 'receive_parcel': return 'light'
        case 'send_parcel': return 'info'
        case 'receive_vilager': return 'success'
        case 'reject_parcel': return 'warning'
        case 'reject_villager' : return 'danger'
        default: return 'dark'
    }
}
export const getStatus = status => {
    switch (status) {
        case 'receive_parcel': return 'รอการส่งมอบ'
        case 'send_parcel': return 'ส่งพัสดุให้ลูกบ้านแล้ว'
        case 'receive_vilager': return 'ลูกบ้านรับพัสดุเรียบร้อย'
        case 'reject_parcel': return 'ยกเลิกรับพัสดุ'
        case 'reject_villager' : return 'ลูกบ้านยกเลิกรับพัสดุ'
        default: return 'ยกเลิกรายการ'
    }
}
export const fields = ['ส่งพัสดุ', 'ที่อยู่', 'รายละเอียด', 'วันที่รับพัสดุ', 'สถานะ',]
