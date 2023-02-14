import { CookieAdvancedTypes } from "./types"

class Machine {
    public allCookies: CookieAdvancedTypes[]
    private machine: CookieAdvancedTypes[] = []
    private hand: CookieAdvancedTypes[] = []
    private dough = 50000
    private kilo = 1000
    private sheetData: any[][] = []
    private list: any[][] = []
    
    constructor( allCookies: CookieAdvancedTypes[], sheetData: any[][]){
        this.allCookies = allCookies
        this.sheetData = sheetData
    }

    init = ()=>{
        try {
            this.CookieCalculation(0)
            return this.list
        } catch (error) {
            console.log(error)
        }
    }

    createDay = (dayList: CookieAdvancedTypes[])=>{
        let isLait = 0  
        let isNoir = 0
        let isBlanc = 0
        for(const cookie of dayList){
            switch(cookie.category_family){
                case "Blanc":
                    isBlanc++
                    break
                case "Lait":
                    isLait++
                    break
                case "Noir":
                    isNoir++
                    break
            }
        }

        if(isLait >= isNoir && isLait >= isBlanc){
            this.machine = dayList.filter(cookie=>cookie.category_family === "Lait")
            this.hand = dayList.filter(cookie=>cookie.category_family !== "Lait")
        }
        else if(isBlanc > isLait && isBlanc >= isNoir) {
            this.machine = dayList.filter(cookie=>cookie.category_family === "Blanc")
            this.hand = dayList.filter(cookie=>cookie.category_family !== "Blanc")
        }
        else if(isNoir > isLait && isNoir > isBlanc) {
            this.machine = dayList.filter(cookie=>cookie.category_family === "Noir")
            this.hand = dayList.filter(cookie=>cookie.category_family !== "Noir")
        }
        
        if(this.machine.length < 2){
            const paradise = this.allCookies.find(cookie=>cookie.category_family === "All")
            if(this.machine.length === 1){
                const machineMatchup = this.allCookies.filter(cookie=>cookie.category_family === this.machine[0].category_family && cookie.cookie_id !== this.machine[0].cookie_id && !cookie.category_isendchain)
                if(this.machine[0].category_family !== 'All' && !this.machine[0].category_isendchain) machineMatchup.push(paradise!) 
                const cookieSelection = machineMatchup.sort((a, b)=>a.cookie_amount - b.cookie_amount)[0]
                this.machine.push(cookieSelection)
            }else if(this.machine.length === 0){
                // TODO: Repair Paradise matchup
                const cookieMostNeeded = this.allCookies.filter(cookie=>cookie.cookie_ismachine).sort((a, b)=>a.cookie_amount - b.cookie_amount)[0]
                const machineMatchup = this.allCookies.filter(cookie=>cookieMostNeeded.category_family === cookie.category_family && cookieMostNeeded.cookie_id !== cookie.cookie_id && !cookieMostNeeded.category_isendchain)
                if(cookieMostNeeded.category_family !== 'All' && !cookieMostNeeded.category_isendchain) machineMatchup.push(paradise!)
                else if(cookieMostNeeded.category_family === 'All') machineMatchup.push(this.allCookies.filter(cookie=>cookie.cookie_ismachine && !cookie.category_isendchain).sort((a, b)=>a.cookie_amount - b.cookie_amount)[0]) 
                const cookieSelection = machineMatchup.sort((a, b)=>a.cookie_amount - b.cookie_amount)[0]
                this.machine.push(cookieMostNeeded, cookieSelection)
            }
        }

        const machineMap = this.machine.map(cookie=>{
            const currentCookie = this.allCookies.find(dbCookie=>cookie.cookie_id === dbCookie.cookie_id)
            if(!currentCookie) return
            const [amountInKilos, amountInPieces] = this.CalculateWeight(currentCookie)
            currentCookie.cookie_amount += amountInPieces
            return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: amountInKilos}
        })
        
        const handMap = this.hand.map(cookie=>{
            const currentCookie = this.allCookies.find(dbCookie=>cookie.cookie_id === dbCookie.cookie_id)
            if(!currentCookie) return
            if(this.hand.length < 1){
                    const [amountInKilos, amountInPieces] = this.CalculateWeight(currentCookie)
                    currentCookie.cookie_amount += amountInPieces
                    return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: amountInKilos}
                }
                const pieces = (this.dough / (cookie.cookie_packaging * cookie.cookie_weight)) * cookie.cookie_packaging
                currentCookie.cookie_amount += pieces
                return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: this.dough / this.kilo} 
        })
            
        this.list.push(machineMap.concat(handMap))
    }
            
    private CookieCalculation = (day: number):()=>void =>{
        if(day > 4) return ()=>{}
        const cookieDayList: CookieAdvancedTypes[] = []
        for(const cookie of this.sheetData){
            const id = cookie[cookie.length - 1]
            const cookieInfos = this.allCookies.find(cookie=>cookie.cookie_id === id)
            const cookieDayByDay = cookie.slice(1, cookie.length - 1)
            const weekNeeds = cookieDayByDay.reduce((total, curr)=>total + parseInt(curr), 0)
            let sommeAsked = 0
            if(cookieInfos){
                cookieInfos.needed = weekNeeds
                for(let i = 0; i < day + 1; i++){
                    sommeAsked += cookieDayByDay[i] * cookieInfos.cookie_packaging
                }
                if(sommeAsked + cookieInfos.cookie_threshold > cookieInfos.cookie_amount){
                    cookieDayList.push({...cookieInfos, needed: weekNeeds})
                }
            }
        }
        this.createDay(cookieDayList)
        return this.CookieCalculation(day + 1)
            
    }

    private CookieAsked = (cookie: any[], currentPosition: number, end: number, result: number[]):number[]=>{
        if(end === currentPosition) return result
        return this.CookieAsked(cookie, currentPosition + 1, end, result)
    }

    private CalculateWeight = (cookie: CookieAdvancedTypes)=>{
        const totalInGram = Math.ceil(cookie.cookie_packaging * cookie.cookie_weight * cookie.needed / this.dough) * this.dough
        const cookieBoxWeight = cookie.cookie_packaging * cookie.cookie_weight
        const kilos = totalInGram / this.kilo
        const piecesAmount = (totalInGram / cookieBoxWeight) * cookie.cookie_packaging
        return [kilos, piecesAmount]
    }
}
    
export default Machine
    