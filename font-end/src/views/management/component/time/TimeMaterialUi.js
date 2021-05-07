import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {CLabel} from '@coreui/react';
import moment from 'moment'
function TimeMaterialUi(props) {
    const {
        title,
        selectedDate,
        setSelectedDate
    } = props;
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const currentTime = moment(selectedDate,'HH:mm:ss');
    const splitTime = {
        hour: currentTime.get('hour'),
        minute: currentTime.get('minute'),
        second: currentTime.get('second')
    }
    const newDate = moment().set(splitTime);
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CLabel>{title}</CLabel><br></br>
            <KeyboardTimePicker
                label=""
                value={newDate}
                onChange={handleDateChange}
                ampm={false}
            />
        </MuiPickersUtilsProvider>
    );
}

export default TimeMaterialUi;