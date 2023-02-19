export type ApiDefaultResponseTypes = {
    status: string
}

export type RoomTypes = {
    room_id: string,
    room_name: string
}

export type CookieTypes = {
    cookie_id: string,
    cookie_name: string,
    cookie_packaging: number,
    cookie_created: string,
    cookie_amount: number,
    cookie_ismachine: boolean,
    cookie_weight: number,
    cookie_threshold: number,
    cookie_ratio: number,
    cookie_onmenu: boolean
}

export interface StockChangesTypes{
    weight: string, 
    amount: string,
    isMachine: boolean,
    onMenu: boolean
}

export interface CookieAdvancedTypes extends CookieTypes{
    cookie_threshold: number,
    cookie_ratio: number,
    cookie_isendchain: boolean,
    category_family: "Lait" | "Noir" | "Blanc" | "None",
    needed: number
}

export type ProdDayTypes = {
    id: string,
    name: string,
    amount: string
} 

export type ProductionListType = {
    cookie_id: string, 
    cookie_name: string, 
    cookie_amount: number
}

export type CookieTotal = {
    id: string,
    name: string,
    amount: number
}

export type DropdownTypes = {
    id: string,
    name: string
}[]