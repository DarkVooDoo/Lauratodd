import {google} from "googleapis"

import Pool from "./DBConnection"

import { CookieAdvancedTypes, StockChangesTypes } from "@/helpers/types"
import Machine from "@/helpers/Machine"

export const GetStock = async ()=>{
    try{
        const {rows:cookies} = await Pool().query<CookieAdvancedTypes>(`SELECT cookie_name, cookie_amount, cookie_weight, cookie_threshold, cookie_ratio,  cookie_id, cookie_created, cookie_ismachine, cookie_packaging FROM Cookie ORDER BY cookie_name ASC`)
        return {stock_cookie: cookies}
    }catch(e){
        throw("Error")
    }
}

export const UpdateStock = async (changes: [string, StockChangesTypes][])=>{
    for(const [id, {amount, weight, isMachine}] of changes){
        try{
            await Pool().query(`UPDATE Cookie SET cookie_amount=$2, cookie_weight=$3, cookie_ismachine=$4  WHERE cookie_id=$1`, [id, amount, weight, isMachine])
        }catch(e){
            throw("Error")
        }
    }
}

export const CalculeWeekProduction = async ()=>{
    try{
        const {rows:cookies} = await Pool().query<CookieAdvancedTypes>(`SELECT cookie_name, cookie_amount, cookie_weight, cookie_threshold, cookie_ratio, cookie_id, cookie_created, cookie_ismachine, cookie_packaging, category_family, category_isendchain FROM Cookie LEFT JOIN Category ON category_cookie_id=cookie_id ORDER BY cookie_name ASC`)
        const auth = await google.auth.getClient({keyFilename: process.env.SHEET_CREDENTIALS, scopes: ["https://www.googleapis.com/auth/spreadsheets"]})
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