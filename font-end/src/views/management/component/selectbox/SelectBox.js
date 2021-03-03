import './SelectBox.css'
import {
    CFormGroup,
    CLabel,
    CSelect,
} from '@coreui/react'
const SelectBox = (props) => {
    const { title, name, items, setSelected } = props;
    let key = 0;
    let optionElem = items.map(item => {
        key++;
        return <option
            key={key}
            name={name}
            value={item.value}
            type={item.type}

        >{item.text}
        </option>
    })
    function onSelectedChange(event) {
        const value = event.target.value;
        const type = event.target.options[event.target.selectedIndex].getAttribute('type');
        console.log(value);
        console.log(type);
        setSelected({value,type})
    }
    return (<CFormGroup >
        <CLabel>{title}</CLabel>
        <CSelect custom
            onChange={onSelectedChange}
        >
            {optionElem}
        </CSelect>
    </CFormGroup>)
}

export default SelectBox;