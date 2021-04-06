import './DatetimePickerInput.css'
import DateTimePicker from 'react-datetime-picker'
import DatePicker from 'react-datepicker'
import { useState } from 'react'
import {
    CInput,
    CLabel,
} from '@coreui/react'
import moment from 'moment'
const DatetimePickerInput = (props) => {
    const { text, setText, title, placeholder, maxLenght, outFocusMode } = props
   function onChangeDatetime(event){
    setText(moment(event.target.value).format("YYYY-MM-DDTHH:mm"))
   }
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
             <CInput 
             type="datetime-local" 
             name="date-input" 
             placeholder='DD/MM/YYYY HH:mm'
             format = 'DD/MM/YYYY HH:mm'
             required
             value={text}
             onChange={event=>{
                onChangeDatetime(event)}}
             />
        </div>
    )
}

export default DatetimePickerInput;