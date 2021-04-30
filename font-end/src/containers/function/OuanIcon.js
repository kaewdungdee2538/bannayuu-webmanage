import {
    FaBeer,
    FaCar,
    FaRegWindowClose,
    FaRegMoneyBillAlt,
    FaCity,
    FaDollyFlatbed,
    FaHome,
    FaScroll,
    FaSplotch,
    FaStamp,
    FaSms,
    FaBullhorn,
    FaParking,
} from "react-icons/fa";
import './OuanIcon.css'
const OuanIcon = (props) => {
    const { name } = props
    const icon = iconName(name);
    return (
        <div>
            {icon}
        </div>
    )
}

const iconName = (name) => {
    switch (name) {
        case 'FaCar':
            return <FaCar className="ouan-icon c-sidebar-nav-icon" />
        case 'FaBeer':
            return <FaBeer className="ouan-icon c-sidebar-nav-icon" />
        case 'FaCity':
            return <FaCity className="ouan-icon c-sidebar-nav-icon" />
        case 'FaRegMoneyBillAlt':
            return <FaRegMoneyBillAlt className="ouan-icon c-sidebar-nav-icon" />
        case 'FaDollyFlatbed':
            return <FaDollyFlatbed className="ouan-icon c-sidebar-nav-icon" />
        case 'FaHome':
            return <FaHome className="ouan-icon c-sidebar-nav-icon" />
        case 'FaScroll':
            return <FaScroll className="ouan-icon c-sidebar-nav-icon" />
        case 'FaSplotch':
            return <FaSplotch className="ouan-icon c-sidebar-nav-icon" />
        case 'FaStamp':
            return <FaStamp className="ouan-icon c-sidebar-nav-icon" />
        case 'FaSms':
            return <FaSms className="ouan-icon c-sidebar-nav-icon" />
        case 'FaBullhorn':
            return <FaBullhorn className="ouan-icon c-sidebar-nav-icon" />
        case 'FaParking':
            return <FaParking className="ouan-icon c-sidebar-nav-icon" />
        default:
            return <FaRegWindowClose className="ouan-icon c-sidebar-nav-icon" />
    }
}

export default OuanIcon;