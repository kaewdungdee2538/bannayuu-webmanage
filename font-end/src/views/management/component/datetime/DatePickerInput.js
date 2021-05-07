import './DatetimePickerInput.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
import moment from 'moment'

const DatePickerInput = (props) => {
    const { 
        text, setText, title, 
        placeholder, maxLenght, outFocusMode
    } = props
   function onChangeDatetime(event){
    setText(moment(event.target.value).format("YYYY-MM-DD"))
   }
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
             <CInput 
             type="date" 
             name="date-input" 
             placeholder='DD/MM/YYYY'
             format = 'DD/MM/YYYY'
             required
             value={text}
             onChange={event=>{
                onChangeDatetime(event)}}
             />
        </div>
    )
}

export default DatePickerInput;