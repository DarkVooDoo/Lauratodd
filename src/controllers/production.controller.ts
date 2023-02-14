
import { CookieTotal, CookieTypes } from "@/helpers/types"
import { CreateCookie } from "@/helpers/utils"

export const onRoomChange = (value: string)=>{
    CreateCookie("room", value, 60*60*24*365)
    return value //setRoom(value)
}

export const onAddCookie = (unit:string, value: string, selectedCookie: any, cookieList: CookieTypes[], cookieTotal: CookieTotal[]):[CookieTypes[], CookieTotal[]]=>{
    cookieList = [{
        cookie_id: selectedCookie.id, 
        cookie_created: "", 
        cookie_packaging: 0, 
        cookie_name: selectedCookie.name, 
        cookie_amount: unit == "pièce" ? parseInt(value) : parseInt(value) * selectedCookie.packaging}, ...cookieList
    ]
    const cookie = cookieTotal.find(cookie=>cookie.id === selectedCookie.id)
    if(!cookie) return [cookieList, cookieTotal = [{id: selectedCookie.id, name: selectedCookie.name, amount: unit == "pièce" ? parseInt(value) : parseInt(value) * selectedCookie.packaging}, ...cookieTotal]]
    cookie.amount += unit == "pièce" ? parseInt(value) : parseInt(value) * selectedCookie.packaging
    return [cookieList, cookieTotal]
}

export const onRemoveCookieFromList = (index: number, cookieList: CookieTypes[], cookieTotal: CookieTotal[]):[CookieTypes[], CookieTotal[]]=>{
    const cookieToRemove = cookieList[index]
    const newCookieList = cookieList.filter((_,i)=>i !== index)
    const total = cookieTotal.find(cookie=>cookie.id === cookieToRemove.cookie_id)
    if(!total) return [cookieList, cookieTotal]
    total.amount -= cookieToRemove.cookie_amount
    return [newCookieList, cookieTotal]
}

export const onUnitChange = (id:string)=>{
    CreateCookie("unit", id, 60*60*24*365)
    return id
}

export const onSubmit = async (cookieTotal: CookieTotal[], room: string)=>{
    const submitProd = await fetch(`/api/production`,{
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({room, payload: cookieTotal})
    })
    if(submitProd.status === 200) return true
    return false
}