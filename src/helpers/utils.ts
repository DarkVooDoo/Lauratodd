
/**
 * @param age in seconds
 */
export const CreateCookie = (name: string, value: string, age: number = 60*60*24, samesite: "lax" | "strict" | "none" = "lax")=>{
    document.cookie = `${name}=${value};max-age=${age};samesite=${samesite}`
}

export const GetCookie = (name: string)=>{
    try{
        return document.cookie.split(";").map(item=>item.trim()).filter(item=>item.startsWith(name))[0].split("=")[1]
    }catch(e){
        return undefined
    }
}

export const CookieProductionToWeight = (packaging: number, weight: number, needed: number):{amountInKilo: string, gram: number, pieces: number}=>{
    const recipe = 50000
    const kilo = 1000
    const amountToDo = Math.ceil(packaging * weight * needed / recipe) * 10
    const amountInGram = packaging * weight * amountToDo * 10
    const amountInKilo = `${packaging * weight * amountToDo / kilo} KG`
    const toPiece = amountInGram / packaging
    return {amountInKilo, gram: amountInGram, pieces: toPiece}
}