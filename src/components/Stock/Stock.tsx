"use client"

import { useState } from "react"

import ListWithHeader from "../ListWithHeader/ListWithHeader"

import { ProdDayTypes } from "@/helpers/types"
import styles from "./styles.module.css"

const Stock:React.FC = ()=>{

    const [mon, setMon] = useState<ProdDayTypes[]>([])
    const [tue, setTue] = useState<ProdDayTypes[]>([])

    const onCalculeProd = async ()=>{
        const test = await fetch(`/api/stock`,{
            method: "POST",
            headers: [["Content-Type", "application/json"]]
        })
        const data = await test.json() as {mon: ProdDayTypes[], tue: ProdDayTypes[]}
        setMon(data.mon)
        setTue(data.tue)
    }
    const monday = mon.map(cookie=>(
        <div key={Math.random()}>
            <p>{cookie.name} </p>
            <p>{cookie.amount} </p>
        </div>
    ))
    const tuesday = tue.map(cookie=>(
        <div key={Math.random()}>
            <p>{cookie.name} </p>
            <p>{cookie.amount} </p>
        </div>
    )) 

    return (
        <div>
            <button onClick={onCalculeProd}>Calcule</button>
            {/* <ListWithHeader {...{headers: ["Nom", "Qté", "Poids"]}} >
                <div></div>
            </ListWithHeader> */}
            {monday.length > 0 ? <h1>Lundi</h1> : null}
            {monday}
            {tuesday.length > 0 ? <h1>Mardi</h1> : null}
            {tuesday}
        </div>
    )
}

export default Stock