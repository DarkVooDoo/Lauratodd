import {useState} from "react"

import { ProdDayTypes } from "@/helpers/types"

import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"
 
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
    const monday = mon.map(cookie=><Dough key={Math.random()} {...{...cookie}} />)
    const tuesday = tue.map(cookie=><Dough key={Math.random()} {...{...cookie}} />) 
    const wednesday = wed.map(cookie=><Dough key={Math.random()} {...{...cookie}} />) 
    const thuesday = thu.map(cookie=><Dough key={Math.random()} {...{...cookie}} />) 
    const friday = fri.map(cookie=><Dough key={Math.random()} {...{...cookie}} />) 

    return (
        <main>
            <button onClick={onCalculeProd}>Calcule</button>
            <h1>Lundi</h1>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{monday}</>
            </ListWithHeader>
            <h1>Mardi</h1>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{tuesday}</>
            </ListWithHeader>
            <h1>Mercredi</h1>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{wednesday}</>
            </ListWithHeader>
            <h1>Jeudi</h1>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{thuesday}</>
            </ListWithHeader>
            <h1>Vendredi</h1>
            <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                <>{friday}</>
            </ListWithHeader>
          
        </main>
    )
}

interface DoughProps{
    name: string,
    amount: string
}

const Dough:React.FC<DoughProps> = ({name, amount})=>{
    return (
        <div key={Math.random()}>
            <p>{name} </p>
            <p>{amount} </p>
        </div>
    )
}

export default ProdCalculation