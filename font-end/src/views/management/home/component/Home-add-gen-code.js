import {useEffect} from 'react'
import '../add/Home-add.css'
import {
    CInput,
    CLabel,
} from '@coreui/react'
const  HomeAddGetCode = (props)=>{
    const { text, setText,title,maxLength } = props
   
    return (
        <div  key={Date.now}>
            <CLabel htmlFor="homecode">{title}</CLabel>
                    <CInput
                        className="modal-input-disable"
                        value={text}
                        disabled
                        maxLength={maxLength}
                    />
        </div>
    )
}

export default HomeAddGetCode;