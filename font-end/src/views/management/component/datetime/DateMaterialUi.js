import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {CLabel} from '@coreui/react';
import { useState } from 'react';
import moment from 'moment'
function DateMaterialUi(props) {
    const {
        title,
        selectedDate,
        setSelectedDate
    } = props;
    
    // function filterWeekends(date) {
    //     // Return false if Saturday or Sunday
    //     return date.getDay() === 0 || date.getDay() === 6;
    // }
    const currentTime = moment(selectedDate);
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CLabel>{title}</CLabel><br></br>
            <KeyboardDatePicker
                format="MM/dd/yyyy"
                label=""
                value={currentTime}
                onChange={setSelectedDate}
                ampm={false}
                // shouldDisableDate={filterWeekends}
            />
        </MuiPickersUtilsProvider>
    );
}

export default DateMaterialUi;