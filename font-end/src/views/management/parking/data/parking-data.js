export const fields = ['จัดการ', 'ประเภทรถ', 'ชื่อ Master Rate', 'ประเภทวัน', 'เริ่ม', 'ถึง']
export const fieldsHeader = ['จัดการ','ประเภทรถ','ชื่อ Zone Rate', 'Start zone', 'Stop zone','สถานะ']
export const fieldsSub = ['จัดการ', 'เวลาจอดตั้งแต่', 'เวลาจอดสิ้นสุด','ค่าบริการ']

export const getBadgeCph = status => {
    switch (status.toUpperCase()) {
        case 'FIRST': return 'success'
        case 'SECOND': return 'secondary'
        default: return 'danger'
    }
}

export const getTextStatusCph = status => {
    switch (status.toUpperCase()) {
        case 'FIRST': return 'หลัก'
        case 'SECOND': return 'รอง'
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

export const convertDayTypeIdToDayTypeKeyString = id =>{
    switch(id){
        case '1': return 'N'
        case '2': return 'SPECIAL'
        case '3': return 'WEEKEND'
        case '4': return 'HOLIDAY'
        default: return null
    }
}
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
export const convertOverNightStatusIdToOverNightStatusKeyString = id =>{
    switch(id){
        case '1': return 'Y'
        case '2': return 'N'
        default: return null
    }
}
