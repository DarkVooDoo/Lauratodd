import { useState } from "react"

import { GetServerSideProps } from "next"

import { CreateCookie } from "@/helpers/utils"
import {DropdownTypes, CookieTypes, CookieTotal} from "@/helpers/types"
import { onAddCookie, onRemoveCookieFromList, onSubmit, onUnitChange } from "@/controllers/production.controller"

import Dropdown from "@/components/Dropdown/Dropdown"
import TextInput from "@/components/TextInput/TextInput"
import CookieListItem from "@/components/CookieListItem/CookieListItem"

import styles from "./styles.module.css"

interface ProductionProps {
    rooms: DropdownTypes,
    dropdownCookies: DropdownTypes,
    cookies: CookieTypes[],
    room: string | undefined,
    unit: string | undefined

}

const Production:React.FC<ProductionProps> = ({rooms, dropdownCookies, cookies, room, unit})=>{
    const units = ["Bac", "Piece"]

    const [unitType, setUnitType] = useState(unit ? unit : units[0])
    const [currentRoom, setCurrentRoom] = useState(room ? room : "Prod")
    const [currentCookie, setCurrentCookie] = useState({id: cookies[0].cookie_id, name: cookies[0].cookie_name, packaging: cookies[0].cookie_packaging})
    const [cookieList, setCookieList] = useState<CookieTypes[]>([])
    const [cookieTotal, setCookieTotal] = useState<CookieTotal[]>([])

    const unitTypes = units.map(item=>(
        <div key={Math.random()}>
            <label htmlFor={item}>{item} </label>
            <input type="radio" name="unit" id={item} checked={unitType === item} onChange={({currentTarget:{id}})=>setUnitType(onUnitChange(id))} />
        </div>
    ))

    const listOfCookies = cookieList.map((cookie, index)=><CookieListItem key={Math.random()} 
    {...{...cookie, 
        index, 
        className: currentRoom === "Cuisson" ? "warning" : "good", 
        onRemove: (index)=>{
            const [list, total] = onRemoveCookieFromList(index, cookieList, cookieTotal)
            setCookieList(list)
            setCookieTotal(total)
        }}
    } />)
    return (
        <main>
            <div className={styles.prod_header}>
                <h1>Production</h1>
                <Dropdown {...{
                    value: currentRoom, 
                    items: rooms, 
                    className: `${styles.prod_header_room}`, 
                    onChange: (id, value)=>{
                    setCurrentRoom(value)
                    CreateCookie("room", value, 60*60*24*150)
                }}} />
            </div>
            <div className={styles.prod_cookieSelection}>
                <Dropdown {...{
                    value: currentCookie.name, 
                    items: dropdownCookies, 
                    className: `${styles.prod_cookieSelection_name}`,
                    onChange: (id, name)=>setCurrentCookie({id, name, packaging: cookies[cookies.findIndex(item=>item.cookie_id === id)].cookie_packaging})
                }} />
                <div className={styles.prod_cookieSelection_types}>
                    {unitTypes}
                </div>
            </div>
            <TextInput {...{type: "number", onConfirm: (value)=>{
                const [list, total] = onAddCookie(unitType, value, currentCookie, cookieList, cookieTotal)
                setCookieList(list)
                setCookieTotal(total)
            }}} />
            {listOfCookies}
            <div className={styles.prod_submit}>
                <button className={styles.prod_submit_btn} onClick={()=>{
                    onSubmit(cookieTotal, currentRoom)
                }}>Enregistrer</button>
            </div>
        </main>
    )
}

export const getServerSideProps:GetServerSideProps = async ({req})=>{
    const fetchData = await fetch(`http://localhost:3000/api/production`)
    const data = await fetchData.json() as {room: DropdownTypes, cookies: CookieTypes[]}
    const {room, unit} = req.cookies
    console.log(req.cookies)
    return {
        props: {...data, room, unit}
    }
}

export default Production