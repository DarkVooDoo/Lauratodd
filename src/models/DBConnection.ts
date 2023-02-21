import {Pool} from "pg"

const DBConnection = ()=>{
    return new Pool({
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432"),
        host: process.env.DB_HOST
    })
}

export default DBConnection