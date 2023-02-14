import {useState} from "react"

import { ProdDayTypes } from "@/helpers/types"
 
const ProdCalculation:React.FC = ()=>{

    const [mon, setMon] = useState<ProdDayTypes[]>([])
    const [tue, setTue] = useState<ProdDayTypes[]>([])
    const [wed, setWed] = useState<ProdDayTypes[]>([])
    const [thu, setThu] = useState<ProdDayTypes[]>([])
    const [fri, setFri] = useState<ProdDayTypes[]>([])

    const onCalculeProd = async ()=>{
        const test = await fetch(`/api/stock`,{
            method: "POST",
            headers: [["Content-Type", "application/json"]]
        })
        const data = await test.json() as ProdDayTypes[][]
        setMon(data[0])
        setTue(data[1])
        setWed(data[2])
        setThu(data[3])
        setFri(data[4])
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
    const wednesday = wed.map(cookie=>(
        <div key={Math.random()}>
            <p>{cookie.name} </p>
            <p>{cookie.amount} </p>
        </div>
    )) 
    const thuesday = thu.map(cookie=>(
        <div key={Math.random()}>
            <p>{cookie.name} </p>
            <p>{cookie.amount} </p>
        </div>
    )) 
    const friday = fri.map(cookie=>(
        <div key={Math.random()}>
            <p>{cookie.name} </p>
            <p>{cookie.amount} </p>
        </div>
    )) 

    return (
        <div>
            <button onClick={onCalculeProd}>Calcule</button>
            <h1>Lundi</h1>
            {monday}
            <h1>Mardi</h1>
            {tuesday}
            <h1>Mercredi</h1>
            {wednesday}
            <h1>Jeudi</h1>
            {thuesday}
            <h1>Vendredi</h1>
            {friday}
          
        </div>
    )
}

export default ProdCalculation