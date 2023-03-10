import {google} from "googleapis"

import Pool from "./DBConnection"

import { CookieAdvancedTypes, StockChangesTypes } from "@/helpers/types"
import Machine from "@/helpers/Machine"

export const GetStock = async ()=>{
    try{
        const {rows:cookies} = await Pool().query<CookieAdvancedTypes>(`SELECT cookie_name, cookie_amount, cookie_weight, cookie_threshold, cookie_ratio, cookie_onmenu, cookie_id, cookie_created, cookie_ismachine, cookie_packaging FROM Cookie ORDER BY cookie_onmenu DESC, cookie_name ASC`)
        const {rows:categorys} = await Pool().query<{category: string}>(`SELECT unnest(enum_range(NULL::Category_enum))::text AS category`)
        const myCategorys = categorys.map(category=>category.category)
        return {stock_cookie: cookies, categorys: myCategorys}
    }catch(e){
        throw("Error")
    }
}

export const UpdateStock = async (changes: [string, StockChangesTypes][])=>{
    for(const [id, {amount, weight, isMachine, onMenu, threshold}] of changes){
        try{
            await Pool().query(`UPDATE Cookie SET cookie_amount=$2, cookie_weight=$3, cookie_ismachine=$4, cookie_onmenu=$5, cookie_threshold=$6  WHERE cookie_id=$1`, [id, amount, weight, isMachine, onMenu, threshold])
        }catch(e){
            throw("Error")
        }
    }
}

export const CalculeWeekProduction = async ()=>{
    try{
        const {rows:cookies} = await Pool().query<CookieAdvancedTypes>(`SELECT cookie_name, cookie_amount, cookie_weight, cookie_threshold, cookie_ratio, cookie_id, cookie_created, cookie_ismachine, cookie_packaging, category_family, cookie_isendchain FROM Cookie LEFT JOIN Category ON category_cookie_id=cookie_id ORDER BY cookie_name ASC`)
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.SHEET_CREDENTIALS || ""),
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        })
        const sheet = google.sheets({version: "v4", auth})
        const response = await sheet.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: "A2:Y30"
        })
        const data = response.data.values
        if(data){
            const machine = new Machine(cookies, data).init()
            return machine
        }
    }catch(e){
        console.log(e)
        throw("Error")
    }
}