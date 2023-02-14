"use client"

import { useEffect, useState } from "react"

import Loading from "src/components/Loading/Loading"
import Dropdown from "../Dropdown/Dropdown"
import TextInput from "../TextInput/TextInput"
import CookieListItem from "../CookieListItem/CookieListItem"

import { GetCookie } from "@/helpers/utils"
import { CookieTotal, CookieTypes, DropdownTypes } from "@/helpers/types"
import { onAddCookie, onRemoveCookieFromList, onRoomChange, onSubmit, onUnitChange } from "@/controllers/production.controller"

import styles from "./styles.module.css"

interface NameProps {
    data: {
        cookies: {
            cookie_id: string,
            cookie_name: string,
            cookie_packaging: number,
            cookie_created: string
        }[],
        rooms: DropdownTypes
    }
}

const Name:React.FC<NameProps> = ({data:{cookies, rooms}})=>{
    const units = ["bac", "pièce"]

    const [loading, setLoading] = useState(true)
    const [unit, setUnit] = useState(GetCookie("unit") || "bac")
    const [room, setRoom] = useState(GetCookie("room") || "Cuisson")
    const [selectedCookie, setSelectedCookie] = useState({id: cookies[0].cookie_id, name: cookies[0].cookie_name, packaging: cookies[0].cookie_packaging})
    const [cookieList, setCookieList] = useState<CookieTypes[]>([])
    const [cookieTotal, setCookieTotal] = useState<CookieTotal[]>([])

    useEffect(()=>{setLoading(false)},[])

    const cookieDropdownList = cookies.map(item=>({id: item.cookie_id, name: item.cookie_name}))
    const checkboxes = units.map(item=>(
        <div key={Math.random()}>
            <input type="radio" name="unit" id={item} checked={unit === item} onChange={({currentTarget:{id}})=>setUnit(onUnitChange(id))} />
            <label htmlFor={item}>{item[0].toUpperCase()+item.substring(1)} </label>
        </div>
    ))
    
    const listOfCookies = cookieList.map((cookie, index)=><CookieListItem key={Math.random()} {...{...cookie, index, className: room === "Cuisson" ? "warning" : "good", onRemove: (index)=>{
        const [list, total] = onRemoveCookieFromList(index, cookieList, cookieTotal)
        setCookieList(list)
        setCookieTotal(total)
    }}} />)
    
    if(!loading){
        return (
            <div>
                <div className={styles.prod_selection}>
                    <Dropdown {...{className: "select_shop_dropdown", value: room, onChange: (_, value)=>setRoom(onRoomChange(value)), items: rooms}} />
                    <div className={styles.prod_selection_units}>
                        {checkboxes}
                    </div>
                </div>
                <Dropdown {...{items: cookieDropdownList, value: selectedCookie.name, onChange: (id, name)=>setSelectedCookie(({id, name, packaging: cookies[cookies.findIndex(item=>item.cookie_id === id)].cookie_packaging}))}} />
                <TextInput {...{type: "number", onConfirm: (value)=>{
                    const [list, total] = onAddCookie(unit, value, selectedCookie, cookieList, cookieTotal)
                    setCookieList(list)
                    setCookieTotal(total)
                }}} />
                <div className={styles.prod_list}>
                    <div className={styles.prod_list_header}>
                        <p className={styles.prod_list_item_name}>Nom</p>
                        <p>Qté</p>
                    </div>
                    {listOfCookies}
                </div>
                <button onClick={async ()=>{
                    const request = await onSubmit(cookieTotal, room)
                    if(request){
                        setCookieList([])
                        setCookieTotal([])
                    }
                }}>Submit</button>
            </div>
        )
    }
    return (
        <Loading />
    )
}

export default Name