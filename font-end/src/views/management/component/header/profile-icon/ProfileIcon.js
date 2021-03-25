import './ProfileIcon.css'
const ProfileIcon = (props) => {
    const { imgLink } = props
    let img_link = imgLink ? `${imgLink}` : `./image/user-profile.png`
    return (
        <div key={Date.now} className="profile-icon">
            <div className="profile-icon-img-icon">
                    <img src={img_link} />
            </div>
        </div>
    )
}

export default ProfileIcon;