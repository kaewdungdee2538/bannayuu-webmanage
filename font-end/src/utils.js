import Moment from 'react-moment';
import 'moment-timezone';
export function convertTZ(date, tzString) {
    const newDate = new Date(date);
    // const newDate =  <Moment date={dateToFormat} />
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const day = newDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const hour = newDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const minute = newDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const second = newDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const dateStr = `${day}/${month}/${year}  ${hour}:${minute}:${second}`
    return dateStr;
} 