import { useRouter } from "next/router"
import { useState } from "react"

import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons"

import {CookieTypes, StockChangesTypes } from "@/helpers/types"

import StockListItem from "@/components/StockListItem/StockListItem"
import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"
import Dropdown from "@/components/Dropdown/Dropdown"
import Modal from "@/components/Modal/Modal"
import CreateCookie from "@/components/CreateCookie/CreateCookie"

import styles from "./styles.module.css"

interface NameProps {
    stock: CookieTypes[],
    category: string[]
}

const Stock:React.FC<NameProps> = ({stock, category})=>{
    const route = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
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

    const onListChange = (id:string, value: StockChangesTypes, hasChange: boolean)=>{
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
            <div className={styles.stock_actions}>
                <button className={styles.stock_actions_newBtn} onClick={()=>setIsModalOpen(true)}>Nouveau cookie</button>
                <Dropdown {...{items: [{id: "Order A-Z", name: "Order A-Z"}, {id: "Hello", name: "Visible"}], value: "Order A-Z"}} />
            </div>
            <ListWithHeader {...{headers: ["Nom", "Au Menu", "Poids", "Machine", "Qté"]}}>
                <>{myStock}</>
            </ListWithHeader>
            {isModalOpen && 
            <Modal {...{state: isModalOpen, className: styles.stock_modal, onChange: (state)=>setIsModalOpen(state)}}>
                <CreateCookie {...{category}} />
            </Modal>}
        </main>
    )
}

export const getServerSideProps = async ()=>{
    const fetchStock = await fetch(`${process.env.URL}/api/stock`)
    const stock = await fetchStock.json() as {stock: CookieTypes[], category: string[]}
    return {
        props:{...stock}
    }
}

export default Stock