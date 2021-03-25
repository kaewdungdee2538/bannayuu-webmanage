import './NotificationIcon.css'
import {
    CBadge,
} from '@coreui/react'
const NotificationIcon = (props) => {
    const { title, imgLink, itemsCount, badgeColor } = props
    let img_link = imgLink ? `${imgLink}` : `./image/user-profile.png`
    return (
        <div key={Date.now} className="noti-icon">
            <div className="noti-icon-img-icon">
                    <img src={img_link} />
            </div>
            <CBadge shape="pill" color={badgeColor}>{itemsCount}</CBadge>
        </div>
    )
}

export default NotificationIcon;