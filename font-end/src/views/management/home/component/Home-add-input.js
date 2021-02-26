import '../add/Home-add.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
const  HomeAddInput = (props)=>{
    const { text, setText,title,placeholder,maxLenght } = props
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <CInput
                className="modal-input"
                placeholder={placeholder}
                value={text}
                onChange={event=>setText(event.target.value)}
                maxLength={maxLenght}
            />
        </div>
    )
}

export default HomeAddInput;