import './InputEnable.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
const InputEnable = (props) => {
    const { text, setText, title, placeholder, maxLenght, outFocusMode } = props
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <CInput
                className="modal-input"
                placeholder={placeholder}
                value={text ? text : ''}
                onChange={event => setText(event.target.value)}
                // onBlur={event=>outFocus(event.target.value)}
                maxLength={maxLenght}
            />
        </div>
    )
}

export default InputEnable;