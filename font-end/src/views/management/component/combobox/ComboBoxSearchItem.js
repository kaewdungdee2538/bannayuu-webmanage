import {
    CLabel,
} from '@coreui/react'
import { useState, } from 'react'
import './ComboBoxSearchItem.css'


export default function ComboBoxSearchItem(props) {
    const { title, text, placeholder, itemsArray, setText } = props;
    //-------------------------State
    const [itemsObj, setItemsObj] = useState(itemsArray)
    const [selectText, setSelectText] = useState(text)
    const [showComboBox, setShowComboxBox] = useState(false);

    //-------------------------on select item
    function onComboClick(event) {
        if (showComboBox) setShowComboxBox(false)
        else setShowComboxBox(true)
    }
    //--------------------------Close Combo box
    function onCloseCombobox(event) {
        setShowComboxBox(false);
        setSelectText(selectText);
    }
    //----------------------------show combobox
    let elemShowComboBox = showComboBox ? 'show-combobox' : 'hide-combobox';
    //-----------------------------items
    let itemsElem = null;
    if (itemsObj) {
        if (itemsObj.length > 0) {
            let num = 0;
            itemsElem = itemsObj.map(item => {
                num++
                return (
                    <input key={num}
                        type="button"
                        className="dropdown-item"
                        defaultValue={item.value}
                        cb_id={item.id}
                        onClick={onClickSelectItemCombobox}
                    />
                )
            })
        }
    }
    //-----------------------------On select item
    function onClickSelectItemCombobox(event) {
        setShowComboxBox(false);
        setSelectText({
            id: event.target.getAttribute('cb_id'),
            value: event.target.value
        })
        setText({
            id: event.target.getAttribute('cb_id'),
            value: event.target.value
        })

    }
    //-----------------------------On filter
    function onChangeFilter(event) {
        const items = itemsArray.filter(item => {
            return item.value.toLowerCase().startsWith(event.target.value.toLowerCase())
        })
        setItemsObj(items)
    }
    return (
        <div key={Date.now}>
            <CLabel>{title}</CLabel>
            <div className="dropdown" >
                <button className="btn btn-secondary dropdown-toggle btn-drop" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    onClick={onComboClick} 
                >
                    {selectText.value}
                </button>
                <div className={`dropdown-menu ${elemShowComboBox}`} aria-labelledby="dropdown_coins">
                    <form className="px-4 py-2" >
                        <input type="search" className="form-control" 
                            placeholder={placeholder}
                            onChange={onChangeFilter}
                        />
                    </form>
                    <div className="item-combobox" onBlur={onCloseCombobox}>{itemsElem}</div>
                    <div  className="dropdown-header">{!itemsArray ? "Items not found" : ""}</div>
                </div>
            </div>
        </div>
    )
}
