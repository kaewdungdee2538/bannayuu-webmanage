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
export const fields = ['แสดง', 'ที่อยู่', 'รายละเอียด', 'วันที่แจ้ง', 'สถานะ',]


export const selectBoxItems = [
    {value:'all',type:"all",text:"ทั้งหมด"}
    ,{value:'N',type:"N",text:"ยังไม่ได้รับเรื่อง"}
    ,{value:'Y',type:"Y",text:"รับเรื่องแล้ว"}
    ]