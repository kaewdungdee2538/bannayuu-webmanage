import './InputEnable.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
const InputNumberEnable = (props) => {
    const { text, setText, title, placeholder, maxLenght, outFocusMode } = props
    function onTextChange(event) {
        const charCode = event.target.value.charCodeAt(event.target.value.length-1)
        if((charCode>=48 && charCode<=57) || (charCode===49) || (event.target.value.length === 0))
            setText(event.target.value)
    }

    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <CInput
                className="modal-input"
                placeholder={placeholder}
                value={text ? text : '0'}
                onChange={onTextChange}
                // onBlur={event=>outFocus(event.target.value)}
                maxLength={maxLenght}
            />
        </div>
    )
}

export default InputNumberEnable;