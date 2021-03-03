import './TextArea.css'
import {
    CTextarea,
    CLabel,
} from '@coreui/react'
const TextArea = (props) => {
    const { text, setText, rows, title, placeholder, maxLenght, outFocusMode } = props
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <CTextarea
                className="modal-input"
                name="textarea-input"
                rows={rows}
                placeholder={placeholder}
                value={text}
                onChange={event => setText(event.target.value)}
                maxLength={maxLenght}
            // onBlur={event=>outFocus(event.target.value)}
            />
        </div>
    )
}

export default TextArea;

