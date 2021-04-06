import './ImageBox.css'
import {
    CLabel,
} from '@coreui/react'
import ApiRoute from '../../../../apiroute'

const ImageBox = (props) => {
    const { title, link } = props
    let img_link = link ? `${ApiRoute.image_web_url}${link}` : `./image/camera-icon.png`
    console.log('link' + link)
    console.log('img_link' + img_link)
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <div className="img-box">
                <img src={img_link} />
            </div>
        </div>
    )
}

export default ImageBox;