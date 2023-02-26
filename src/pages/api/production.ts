
import type { NextApiRequest, NextApiResponse } from 'next'

import { SaveProduction, GetProductionData } from '@/models/production.model'
import { ApiDefaultResponseTypes, CookieTypes, DropdownTypes, RoomTypes } from '@/helpers/types'

type Data = {
    rooms: DropdownTypes,
    cookies: CookieTypes[],
    dropdownCookies: DropdownTypes
}

const ProductionAPI = async (req: NextApiRequest, res: NextApiResponse<Data | ApiDefaultResponseTypes>)=>{
    if(req.method === "GET"){
        try{
            const {rooms, cookies} = await GetProductionData()
            const adaptedCookies = cookies.map(cookie=>({id: cookie.cookie_id, name: cookie.cookie_name}))
            res.send({rooms, cookies, dropdownCookies: adaptedCookies})
        }catch(e){
            res.status(403)
        }
    }else if(req.method === "PUT"){
        try{
            await SaveProduction(req.body)
            res.status(200).send({status: "Success"})
        }catch(e){
            res.status(400).send({status: "Failed"})
        }
    }
}

export default ProductionAPI
