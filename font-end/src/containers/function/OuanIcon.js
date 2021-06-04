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
    FaChevronCircleRight,
    FaShippingFast,
    FaIdCardAlt,
    FaLock,
} from "react-icons/fa";
import {
    RiRotateLockFill,
    RiLockLine,
} from "react-icons/ri"
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
        case 'FaChevronCircleRight':
            return <FaChevronCircleRight className="ouan-icon c-sidebar-nav-icon" />
        case 'FaShippingFast':
            return <FaShippingFast className="ouan-icon c-sidebar-nav-icon" />
        case 'FaIdCardAlt':
            return <FaIdCardAlt className="ouan-icon c-sidebar-nav-icon" />
        case 'FaLock':
            return <FaLock className="ouan-icon c-sidebar-nav-icon" />
        case 'RiRotateLockFill':
            return <FaLock className="ouan-icon c-sidebar-nav-icon" />
        case 'RiLockLine':
            return <RiLockLine className="ouan-icon c-sidebar-nav-icon" />
        default:
            return <FaRegWindowClose className="ouan-icon c-sidebar-nav-icon" />
    }
}
export const OuanIconForBtn = (props) => {
    const { name } = props
    const icon = iconNameForBtn(name);
    return (
        <div>
            {icon}
        </div>
    )
}

const iconNameForBtn = (name) => {
    switch (name) {
        case 'FaCar':
            return <FaCar className="ouan-icon-for-btn" />
        case 'FaBeer':
            return <FaBeer className="ouan-icon-for-btn" />
        case 'FaCity':
            return <FaCity className="ouan-icon-for-btn" />
        case 'FaRegMoneyBillAlt':
            return <FaRegMoneyBillAlt className="ouan-icon-for-btn" />
        case 'FaDollyFlatbed':
            return <FaDollyFlatbed className="ouan-icon-for-btn" />
        case 'FaHome':
            return <FaHome className="ouan-icon-for-btn" />
        case 'FaScroll':
            return <FaScroll className="ouan-icon-for-btn" />
        case 'FaSplotch':
            return <FaSplotch className="ouan-icon-for-btn" />
        case 'FaStamp':
            return <FaStamp className="ouan-icon-for-btn" />
        case 'FaSms':
            return <FaSms className="ouan-icon-for-btn" />
        case 'FaBullhorn':
            return <FaBullhorn className="ouan-icon-for-btn" />
        case 'FaParking':
            return <FaParking className="ouan-icon-for-btn" />
        case 'FaChevronCircleRight':
            return <FaChevronCircleRight className="ouan-icon-for-btn" />
        case 'FaShippingFast':
            return <FaShippingFast className="ouan-icon-for-btn" />
        case 'FaLock':
            return <FaLock className="ouan-icon-for-btn" />
        case 'RiRotateLockFill':
            return <RiRotateLockFill className="ouan-icon-for-btn" />
        case 'RiLockLine':
            return <RiLockLine className="ouan-icon-for-btn" />
        default:
            return <FaRegWindowClose className="ouan-icon-for-btn" />
    }
}
export default OuanIcon;