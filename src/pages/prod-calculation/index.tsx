import {useState} from "react"

import { ProdDayTypes } from "@/helpers/types"

import ListWithHeader from "@/components/ListWithHeader/ListWithHeader"
import Head from "next/head"

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]
 
const ProdCalculation:React.FC = ()=>{

    const [week, setWeek] = useState<ProdDayTypes[][]>([])

    const onCalculeProd = async ()=>{
        const calculateProd = await fetch(`/api/stock`,{
            method: "POST",
            headers: [["Content-Type", "application/json"]]
        })
        const data = await calculateProd.json() as ProdDayTypes[][]
        setWeek(data)
    }
    const prodToMake = week.map((day, index)=>{
        const dayToMake = day.map(cookie=><Dough key={`${cookie.id}${index}`} {...{...cookie}} />)
        return (
            <div key={index}>
                {day.length > 0 ? 
                <>
                    <h1>{DAYS[index]} </h1>
                    <ListWithHeader {...{headers: ["Nom", "Qté"]}}>
                        <>{dayToMake}</>
                    </ListWithHeader> 
                </>: null}
            </div>
        )
    })

    return (
        <>
            <Head>
                <title>Semaine estimation</title>
                <meta name="description" content="Laura todd semaine estimation" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <button onClick={onCalculeProd}>Calcule</button>
                {prodToMake}
            </main>
        </>
    )
}

interface DoughProps{
    name: string,
    amount: string
}

const Dough:React.FC<DoughProps> = ({name, amount})=>{
    return (
        <div>
            <p>{name} </p>
            <p>{amount} </p>
        </div>
    )
}

export default ProdCalculation