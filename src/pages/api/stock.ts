import { NextApiRequest, NextApiResponse } from "next"

import { CalculeWeekProduction, GetStock, UpdateStock } from "@/models/stock.model"

const Stock = async (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method === "GET"){
        try{
            const stock = await GetStock()
            res.send({stock: stock.stock_cookie})
    }catch(e){
            res.status(403).send({status: "Failed"})
        }
    }else if(req.method === "POST"){
        try{
            const week = await CalculeWeekProduction()
            res.send(week)
        }catch(e){
            res.status(400).send({status: "Failed"})
        }
    }else if(req.method === "PUT"){
        try{
            await UpdateStock(req.body.changes)
            res.send("Success")
        }catch(e){
            res.status(400).send({status: "Failed"})
        }
    }
}

export default Stock