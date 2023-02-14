import {Pool} from "pg"

export default ()=>{
    return new Pool({
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 5432,
        host: process.env.DB_HOST
    })
}