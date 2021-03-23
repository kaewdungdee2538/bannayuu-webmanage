import './StatusItem.css'
import {
    CBadge,
    CLabel,
} from '@coreui/react'
const getBadge = status => {
    switch (status) {
        case 'active': return 'success'
        case 'posted': return 'secondary'
        case 'pending': return 'warning'
        case 'cancel': return 'danger'
        default: return 'primary'
    }
}
const StatusItem = (props) => {
    const { text, title } = props
    return (
        <div key={Date.now} className="status-form">
            <CLabel>{title}</CLabel>
            <CBadge color={getBadge(text)} className="item">
                <span>{text}</span>
            </CBadge>
        </div>
    )
}

export default StatusItem;