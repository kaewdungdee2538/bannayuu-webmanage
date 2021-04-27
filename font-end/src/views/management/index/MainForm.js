import './MainForm.css'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
export default function MainForm(props) {
    const history = useHistory();
    const authStore = useSelector(state => state)
    if (!authStore.authorization) {
        history.push("/login");
    }
    return (
        <div className="main-form">
            <img src={'./image/logo-big.svg'} />
        </div>
    );
}