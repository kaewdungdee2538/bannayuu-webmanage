import './ImageProfile.css'
import {
    CLabel,
} from '@coreui/react'
import ApiRoute from '../../../../apiroute'

const ImageBoxProfile = (props) => {
    const { title, link } = props
    let img_link = link ? `${ApiRoute.image_web_url}${link}` : `./image/user-profile.png`
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <div className="img-profile">
                <img src={img_link} />
            </div>
        </div>
    )
}

export default ImageBoxProfile;