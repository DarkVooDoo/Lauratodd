import { useRouter } from "next/router"
import { useState } from "react"

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons"

import {CookieTypes } from "@/helpers/types"

import StockListItem from "@/components/StockListItem/StockListItem"
import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"

import styles from "./styles.module.css"

interface NameProps {
    stock: CookieTypes[]
}

const Stock:React.FC<NameProps> = ({stock})=>{
    const route = useRouter()
    const [changes, setChanges] = useState(new Map())
    const [hasChange, setHasChange] = useState(false)

    const onUpdateStock = async ()=>{
        const toChange = Array.from(changes)
        const updateStock = await fetch(`/api/stock`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({changes: toChange})
        })
        if(updateStock.status === 200) route.push("/")
    }

    const onListChange = (id:string, value: string, hasChange: boolean)=>{
        if(hasChange) setChanges(changes.set(id, value))
        else{
            changes.delete(id)
            setChanges(changes)
        }
        if(changes.size > 0) setHasChange(true)
        else setHasChange(false)
    }
    const myStock = stock.map(cookie=><StockListItem key={cookie.cookie_id} {...{...cookie, onListChange}} />)
    return (
        <main>
            <div className={styles.stock_top}>
                <h1>Stock</h1>
                <button 
                onClick={onUpdateStock} 
                disabled={!hasChange}
                style={{backgroundColor: `${hasChange ? "var(--Primary_Color)" : "lightgray"}`}}
                className={styles.stock_top_updateBtn}>
                    <Icon {...{icon: faCloudArrowUp, size: '1x'}} />
                </button>
            </div>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{myStock}</>
            </ListWithHeader>
        </main>
    )
}

export const getServerSideProps = async ()=>{
    const fetchStock = await fetch(`${process.env.URL}/api/stock`)
    const stock = await fetchStock.json() as {stock: CookieTypes[]}
    return {
        props:{...stock}
    }
}

export default Stock