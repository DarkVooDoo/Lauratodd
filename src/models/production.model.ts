import Pool from "./DBConnection"

import { CookieTotal, CookieTypes, RoomTypes } from "@/helpers/types"

export const GetProductionData = async ()=>{
    try{
        const {rows} = await Pool().query<RoomTypes>(`SELECT room_id, room_name FROM Room`)
        const rooms = rows.map(item=>({id: item.room_id, name: item.room_name}))
        const {rows:cookies} = await Pool().query<CookieTypes>(`SELECT cookie_id, cookie_name, cookie_amount, cookie_packaging FROM Cookie ORDER BY cookie_name ASC`)
        return {
            rooms,
            cookies
        }
    }catch(e){
        throw("Error")
    }
}

export const CalculateProduction = async ({room, payload}:{room: string, payload: CookieTotal[]})=>{
    try{
        for(let cookie of payload){
            if(room === "Cuisson") await Pool().query(`UPDATE Cookie SET cookie_amount = cookie_amount - $1 WHERE cookie_id=$2`, [cookie.amount, cookie.id])
            else await Pool().query(`UPDATE Cookie SET cookie_amount = cookie_amount + $1 WHERE cookie_id=$2`, [cookie.amount, cookie.id])
        }
    }catch(e){
        console.log(e)
        throw("Error")
    }
}