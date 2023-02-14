"use client"

import { CookieTypes } from "@/helpers/types"

import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"
import styles from "@/components/ListWithHeader/styles.module.css"
import { useEffect, useState } from "react"

interface LandpageProps {
    cookies: CookieTypes[]
}

const Landpage:React.FC<LandpageProps> = ({cookies})=>{

    const cookieList = cookies.map(cookie=><ListInput key={Math.random()} {...{cookie_name: cookie.cookie_name, cookie_amount: cookie.cookie_amount}} />)
    return (
        <div>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}} >
                <div>
                    {cookieList}
                </div>
            </ListWithHeader>

        </div>
    )
}

const ListInput:React.FC<{cookie_name: string, cookie_amount: number}> = ({cookie_name, cookie_amount})=>{
    const [amount, setAmount] = useState(cookie_amount.toString())

    return (
        <div key={Math.random()} className={styles.list_content}>
            <p className={styles.list_content_item}>{cookie_name} </p>
            <input type="text" name="amount" id="amount" value={amount} onChange={({target:{value}})=>setAmount(value)} />
        </div>
    )
}

export default Landpage