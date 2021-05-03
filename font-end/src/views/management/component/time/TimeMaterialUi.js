import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {CLabel} from '@coreui/react';
import { useState } from 'react';
import moment from 'moment'
function TimeMaterialUi(props) {
    const {
        title,
        selectedDate,
        setSelectedDate
    } = props;
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDate(date);
    };
    const currentTime = moment(selectedDate,'HH:mm:ss');
    const splitTime = {
        hour: currentTime.get('hour'),
        minute: currentTime.get('minute'),
        second: currentTime.get('second')
    }
    const newDate = moment().set(splitTime);
    const [date, setDate] = useState(newDate);
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CLabel>{title}</CLabel>
            <KeyboardTimePicker
                label=""
                value={date}
                onChange={handleDateChange}
                ampm={false}
            />
        </MuiPickersUtilsProvider>
    );
}

export default TimeMaterialUi;