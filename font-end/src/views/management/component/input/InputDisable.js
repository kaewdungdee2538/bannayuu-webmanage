import './InputDisable.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
const InputDisable = (props) => {
    const { text, setText, title, maxLength } = props
    return (
        <div key={Date.now}>
            <CLabel htmlFor="homecode">{title}</CLabel>
            <CInput
                className="modal-input-disable"
                value={text ? text : '-'}
                disabled
                maxLength={maxLength}
            />
        </div>
    )
}

export default InputDisable;