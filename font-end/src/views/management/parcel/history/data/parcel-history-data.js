export const fields = ['แสดง', 'ที่อยู่', 'รายละเอียด', 'วันที่รับพัสดุ', 'สถานะ',]

export const getBadge = status => {
    switch (status) {
        case 'receive_parcel': return 'light'
        case 'send_parcel': return 'primary'
        case 'receive_vilager': return 'success'
        default: return 'danger'
    }
}
export const getStatus = status => {
    switch (status) {
        case 'receive_parcel': return 'รอการส่งมอบ'
        case 'send_parcel': return 'ส่งพัสดุให้ลูกบ้านแล้ว'
        case 'receive_vilager': return 'ลูกบ้านรับพัสดุเรียบร้อย'
        default: return 'ยกเลิกรายการ'
    }
}
export const selectBoxItem = [
    { text: 'ทั้งหมด', value: 'all', type: 'all' }
    , { text: 'รอการส่งมอบ', value: 'receive_parcel', type: 'receive_parcel' }
    , { text: 'ส่งพัสดุให้ลูกบ้านแล้ว', value: 'send_parcel', type: 'send_parcel' }
    , { text: 'ลูกบ้านรับพัสดุเรียบร้อย', value: 'receive_vilager', type: 'receive_vilager' }
]