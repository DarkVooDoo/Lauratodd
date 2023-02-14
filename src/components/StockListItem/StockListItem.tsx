import { useState } from "react"

import {CookieTypes } from "@/helpers/types"

import styles from "./styles.module.css"

interface StockListItemProps extends CookieTypes {
    onListChange: (id: string, value: string, hasChange: boolean)=>void
}

const StockListItem:React.FC<StockListItemProps> = ({cookie_id, cookie_name, cookie_amount, onListChange})=>{

    const [amount, setAmount] = useState(cookie_amount.toString())

    return (
        <div className={styles.cookie}>
            <p>{cookie_name} </p>
            <div className={styles.cookie_amount}>
                <input type="number" className={styles.cookie_amount_input} name="amount" id="amount" value={amount} onChange={({target:{value}})=>setAmount(value)} onBlur={()=>{
                    if(cookie_amount.toString() !== amount) return onListChange(cookie_id, amount, true)
                    onListChange(cookie_id, amount, false)
                }} />
            </div>
        </div>
    )
}

export default StockListItem