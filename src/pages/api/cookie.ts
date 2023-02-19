import { NextApiRequest, NextApiResponse } from "next"

import { CreateCookie } from "@/models/cookie.model"

const CookieEndpointApi = async (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method === "GET"){
        try{
            
        }catch(e){
            res.status(403).send({status: "Forbidden"})
        }
    }else if(req.method === "POST"){
        try{
            await CreateCookie(req.body)
            res.send("Success")
        }catch(e){
            res.status(403).send({status: "Forbidden"})
        }   
    }
}

export default CookieEndpointApi