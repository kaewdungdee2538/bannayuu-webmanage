import {
    CHeader,
    CLabel,
    CAlert,
    CProgress,
} from '@coreui/react'
import { useHistory } from 'react-router-dom'
import './AlertPopup.css'

export default function AlertPopup(props) {
    const history = useHistory();
    const { timeShowAlert, setTimeShowAlert, title, text, color, activeClass, imgIcon,link } = props;
    let showClass = activeClass ? "show-alert" : "hidden-alert"
    let img_type = (value) => {
        switch (value) {
            case 'sos':
                return './image/sos.svg'
            default:
                return ''
        }
    }

    function onClickPopup(event){
        history.push(link);
        setTimeShowAlert(null);
    }
    return (
        <div className={`alert-main`}>
            <CAlert
                className={`alert-propup show-alert`}
                color={color}
                // show={timeShowAlert}
                // closeButton
                onShowChange={setTimeShowAlert}
                onClick={onClickPopup}
            >
                <div className="alert-img">
                    <img src={img_type(imgIcon)} />
                </div>
                <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                </div>
                {/* <CProgress
        striped
        color="warning"
        value={Number(showAlertSos) * 10}
        size="xs"
        className="mb-3"
      /> */}
            </CAlert>
        </div>

    )
}
