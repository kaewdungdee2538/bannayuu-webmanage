import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function ComboBoxMaterial(props) {
    const classes = useStyles();
    const { title, itemArrays } = props;
    const [itemSelect, setItemSelect] = React.useState('');

    const handleChange = (event) => {
        setItemSelect(event.target.value);
    };
    let menuItems = null;
    if (itemArrays.length > 0) {
        menuItems = itemArrays.map(item => {
            return (
                <div>
                    <MenuItem key={item.id}
                        value={item.id}
                    >
                        {item.value}
                    </MenuItem>
                </div>
            )
        })
    }
    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">{title}</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={itemSelect}
                    onChange={handleChange}
                    label={title}
                >
                    
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    {menuItems}
                </Select>
            </FormControl>
        </div>
    );
}