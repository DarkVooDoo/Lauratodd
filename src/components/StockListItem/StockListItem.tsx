import { useState } from "react"

import {CookieTypes, StockChangesTypes } from "@/helpers/types"

import ToggleButton from "../ToggleButton/ToggleButton"

import styles from "./styles.module.css"

interface StockListItemProps extends CookieTypes {
    onListChange: (id: string, value: StockChangesTypes, hasChange: boolean)=>void
}

const StockListItem:React.FC<StockListItemProps> = ({cookie_id, cookie_name, cookie_amount, cookie_weight, cookie_ismachine, onListChange})=>{
    const [amount, setAmount] = useState(cookie_amount.toString())
    const [isMachine, setIsMachine] = useState(cookie_ismachine)
    const [weight, setWeight] = useState(cookie_weight.toString())

    const onFieldChange = ()=>{
        if(cookie_weight.toString() !== weight || cookie_amount.toString() !== amount || !isMachine !== cookie_ismachine) return onListChange(cookie_id, {weight, amount, isMachine: !isMachine}, true)
        onListChange(cookie_id, {weight, amount, isMachine: !isMachine}, false)
    }

    return (
        <div className={styles.cookie}>
            <p className={styles.cookie_name}>{cookie_name} </p>
            <div className={`${styles.large_screen} ${styles.cookie_field}`}>
                <input 
                type="number" 
                className={styles.cookie_field_input} 
                name="weight" 
                id="weight" 
                value={weight} 
                onChange={({target:{value}})=>setWeight(value)} 
                onBlur={onFieldChange} />
            </div>
            <div className={styles.large_screen}>
                <ToggleButton {...{state: cookie_ismachine, onChange: ()=>{
                    setIsMachine(prev=>!prev)
                    onFieldChange()
                }}} />
            </div>
            <div className={styles.cookie_field}>
                <input 
                type="number" 
                className={styles.cookie_field_input} 
                name="amount" 
                id="amount" 
                value={amount} 
                onChange={({target:{value}})=>setAmount(value)} 
                onBlur={onFieldChange} />
            </div>
        </div>
    )
}

export default StockListItem