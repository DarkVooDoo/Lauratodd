
import { ProductionTypes } from "@/helpers/types"
import { CreateCookie } from "@/helpers/utils"

export const onRoomChange = (value: string)=>{
    CreateCookie("room", value, 60*60*24*365)
    return value //setRoom(value)
}

export const onUnitChange = (id:string)=>{
    CreateCookie("unit", id, 60*60*24*365)
    return id
}

export const onSubmit = async (room: string, cookies: Map<string, ProductionTypes>)=>{
    const submitProd = await fetch(`/api/production`,{
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({room, payload: Array.from(cookies.values())})
    })
    if(submitProd.status === 200) return true
    return false
}