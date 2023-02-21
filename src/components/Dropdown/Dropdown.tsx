"use client"

import { MouseEventHandler, useState } from "react"

import styles from './Dropdown.module.css'

interface DropdownProps{
    value: string,
    items: {id: string, name: string, icon?: JSX.Element}[],
    className?: string,
    onChange?: (id:string, value: string)=> void
}

const Dropdown:React.FC<DropdownProps> = ({items, className, onChange, value})=>{

    const [open, setOpen] = useState(false)

    const onSelectionClick= ({id, name}:{id: string, name: string})=>{
        onChange && onChange(id, name)
        setOpen(!open)
    }

    const dropdownList = items.map(item=>(
        <div key={item.id} className={styles.dropdown_list_item} onClick={()=>onSelectionClick(item)} > 
            {item.icon}
            <p>{item.name}</p>
        </div>
    ))

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={`${styles.dropdown}  ${open ? styles.selected : ""}`} onClick={()=>setOpen(!open)} >{value} </div>
            <div className={`${styles.dropdown_list} ${open ? styles.open : ""}`}>
                {dropdownList}
            </div>
        </div>
    )
}

export default Dropdown