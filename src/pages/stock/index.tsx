import { useRouter } from "next/router"
import { useState } from "react"

import {CookieTypes } from "@/helpers/types"

import StockListItem from "@/components/StockListItem/StockListItem"
import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"

interface NameProps {
    stock: CookieTypes[]
}

const Stock:React.FC<NameProps> = ({stock})=>{
    const route = useRouter()
    const [changes, setChanges] = useState(new Map())

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
    }
    const myStock = stock.map(cookie=><StockListItem key={cookie.cookie_id} {...{...cookie, onListChange}} />)
    return (
        <main>
            <div style={{display: "flex", justifyContent: "space-between", margin: "var(--Rows_Margin) 0"}}>
                <h1>Stock</h1>
                <button onClick={onUpdateStock}>Enregistrer</button>
            </div>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{myStock}</>
            </ListWithHeader>
        </main>
    )
}

export const getServerSideProps = async ()=>{
    const fetchStock = await fetch(`http://localhost:3000/api/stock`)
    const stock = await fetchStock.json() as {stock: CookieTypes[]}
    return {
        props:{...stock}
    }
}

export default Stock