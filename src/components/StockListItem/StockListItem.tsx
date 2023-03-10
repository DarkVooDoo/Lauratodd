import { useEffect, useState } from "react"
import Image from "next/image"

import {CookieTypes, StockChangesTypes } from "@/helpers/types"

import ToggleButton from "../ToggleButton/ToggleButton"

import styles from "./styles.module.css"

interface StockListItemProps extends CookieTypes {
    onCopy: (id: string)=> void,
    onListChange: (id: string, value: StockChangesTypes, hasChange: boolean)=>void
}

const StockListItem:React.FC<StockListItemProps> = ({cookie_id, cookie_name, cookie_threshold, cookie_amount, cookie_weight, cookie_ismachine, cookie_onmenu, onListChange, onCopy})=>{
    
    const [amount, setAmount] = useState(cookie_amount.toString())
    const [isMachine, setIsMachine] = useState(cookie_ismachine)
    const [onMenu, setOnMenu] = useState(cookie_onmenu)
    const [weight, setWeight] = useState(cookie_weight.toString())
    const [threshold, setThreshold] = useState(cookie_threshold.toString())

    useEffect(()=>{
        if(
            cookie_weight.toString() !== weight || 
            cookie_amount.toString() !== amount || 
            cookie_ismachine !== isMachine || 
            onMenu !== cookie_onmenu || 
            threshold !== cookie_threshold.toString()) return onListChange(cookie_id, {weight, amount, isMachine, onMenu, threshold}, true)
        onListChange(cookie_id, {weight, amount, isMachine, onMenu, threshold}, false)
    }, [weight, amount, onMenu, isMachine, threshold])

    return (
        <div className={styles.cookie}>
            <div className={styles.cookie_name}>
                {cookie_name} 
                <span onClick={()=>onCopy(cookie_id)}><Image src="copy.svg" alt="Test" width={25} height={25} className={styles.cookie_name_copy} /></span>
            </div>
            <div className={styles.cookie_field}>
                <input 
                type="number" 
                className={styles.cookie_field_input} 
                name="amount" 
                id="amount" 
                value={amount} 
                onChange={({target:{value}})=>setAmount(value)} />
            </div>
            <ToggleButton {...{state: cookie_onmenu, onChange: ()=>{
                setOnMenu(prev=>!prev)
            }}} />
            <div className={`${styles.cookie_field}`}>
                <input 
                type="number" 
                className={styles.cookie_field_input} 
                name="weight" 
                id="weight" 
                value={weight} 
                onChange={({target:{value}})=>setWeight(value)} />
            </div>
            <div className={styles.cookie_field}>
                <input 
                type="number" 
                className={styles.cookie_field_input} 
                name="threshold" 
                id="threshold" 
                value={threshold} 
                onChange={({target:{value}})=>setThreshold(value)} />
            </div>
            <ToggleButton {...{state: cookie_ismachine, onChange: ()=>{
                setIsMachine(prev=>!prev)
            }}} />
        </div>
    )
}

export default StockListItem