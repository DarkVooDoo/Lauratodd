import Pool from "./DBConnection"

type CookieCreationPayload = {
    name: string,
    amount: string,
    weight: string,
    packaging: string,
    threshold: string,
    isMachine: boolean,
    onMenu: boolean,
    family: string[]
}

export const CreateCookie = async ({name, amount, isMachine, onMenu, packaging, threshold, weight, family}:CookieCreationPayload)=>{
    try{
        const {rows:cookie} = await Pool().query<{cookie_id: string}>(
            `INSERT INTO Cookie (cookie_name, cookie_amount, cookie_packaging, cookie_threshold, cookie_weight, cookie_onmenu, cookie_ismachine) 
            VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING cookie_id`,
        [name, amount, packaging, threshold, weight, onMenu, isMachine])
        const id = cookie[0].cookie_id
        for(const fam of family){
            await Pool().query(`INSERT INTO Category (category_family, category_cookie_id) VALUES($1,$2)`, [fam, id])
        }
    }catch(e){
        console.log(e)
        throw("Error")
    }
}