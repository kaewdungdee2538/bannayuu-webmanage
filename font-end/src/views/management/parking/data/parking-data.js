export const fields = ['จัดการ', 'ประเภทรถ', 'ชื่อ Master Rate', 'ประเภทวัน', 'เริ่ม', 'ถึง']
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

export const getDayTypeId = type =>{
    switch(type){
        case 'N': return '1'
        case 'SPECIAL': return '2'
        case 'WEEKEND': return '3'
        case 'HOLIDAY': return '4'
        default: return null
    }
}
export const getDayTypeName = type =>{
    switch(type){
        case 'N': return 'วันปกติ'
        case 'SPECIAL': return 'วันพิเศษ'
        case 'WEEKEND': return 'วันหยุดสุดสัปดาห์'
        case 'HOLIDAY': return 'วันนักขัตฤกษ์'
        default: return null
    }
}
export const comboBoxItemForDayTypesArr = [
    {
        id: 1, value: "วันปกติ"
    }, {
        id: 2, value: "วันพิเศษ"
    }, {
        id: 3, value: "วันหยุดสุดสัปดาห์"
    }, {
        id: 4, value: "วันนักขัตฤกษ์"
    }
]

export const getOverNightStatusId = type =>{
    switch(type){
        case 'Y': return '1'
        case 'N': return '2'
        default: return null
    }
}
export const getOverNightStatusName = type =>{
    switch(type){
        case 'Y': return 'เสียค่าปรับค้างคืน'
        case 'N': return 'ไม่เสียค่าปรับค้างคืน'
        default: return null
    }
}
export const comboBoxItemForOverNightStatusArr = [
    {
        id:1,value:"เสียค่าปรับค้างคืน"
    },{
        id:2,value:"ไม่เสียค่าปรับค้างคืน"
    }
]

