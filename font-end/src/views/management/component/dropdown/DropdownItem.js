import './DropdownItem.css'
import {
    CBadge,
} from '@coreui/react'

const DropDownItem = (props) => {
    const { title, imgLink, itemsCount, badgeColor } = props
    let img_link = imgLink ? `${imgLink}` : `./image/user-profile.png`
    return (
        <div key={Date.now} className="drop-item">
            <div className="drop-container">
                <div className="drop-img-icon">
                    <img src={img_link} />
                </div>
                <span>{title}</span>
            </div>
            <div>
                <CBadge shape="pill" color={badgeColor}>{itemsCount}</CBadge>
            </div>
        </div>
    )
}

export default DropDownItem;