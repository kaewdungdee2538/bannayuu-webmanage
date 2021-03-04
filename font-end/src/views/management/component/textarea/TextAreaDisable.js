import './TextArea.css'
import {
    CTextarea,
    CLabel,
} from '@coreui/react'
const TextAreaDisable = (props) => {
    const { text, setText, rows, title, placeholder, maxLenght, outFocusMode } = props
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <CTextarea
                name="textarea-input"
                rows={rows}
                placeholder={placeholder}
                value={text}
                onChange={event => setText(event.target.value)}
                maxLength={maxLenght}
                disabled
            // onBlur={event=>outFocus(event.target.value)}
            />
        </div>
    )
}

export default TextAreaDisable;

