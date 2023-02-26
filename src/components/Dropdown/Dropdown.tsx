import { useState } from "react"

import styles from './Dropdown.module.css'

interface DropdownProps{
    value: string,
    id: string,
    items: {id: string, name: string, icon?: JSX.Element}[],
    className?: string,
    onChange?: (id:string, value: string)=> void
}

let listTimeout:NodeJS.Timeout
const Dropdown:React.FC<DropdownProps> = ({items, id, className, onChange, value})=>{

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [myList, setMyList] = useState(items)

    const onSelectionClick= ({id, name}:{id: string, name: string})=>{
        onChange && onChange(id, name)
        setOpen(!open)
    }

    const dropdownList = myList.map(item=>(
        <div key={item.id} className={styles.dropdown_list_item} onClick={()=>onSelectionClick(item)} > 
            {item.icon}
            <p>{item.name}</p>
        </div>
    ))

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={`${styles.dropdown}  ${open ? styles.selected : ""}`} >
            <label htmlFor={`${id}`} className={styles.dropdown_search_label} onClick={()=>{setOpen(!open)}}>{value}</label>
            <input 
                type="text" 
                name={`${id}`} 
                className={styles.dropdown_search} 
                id={`${id}`} value={searchValue} 
                onChange={({target:{value}})=>{
                    setSearchValue("")
                    const search = items.filter(item=>item.name.toLowerCase().startsWith(value.toLocaleLowerCase()))
                    setMyList(search.length > 0 ? [...search] : items)
                }}
                onFocus={()=>{
                    clearTimeout(listTimeout)
                    listTimeout = setTimeout(()=>{
                        setMyList(items)
                    }, 1000)
                    // setMyList(items)
                }} /></div>
            <div className={`${styles.dropdown_list} ${open ? styles.open : ""}`}>
                {dropdownList}
            </div>
        </div>
    )
}

export default Dropdown