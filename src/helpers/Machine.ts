import { CookieAdvancedTypes, ProdDayTypes } from "./types"

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

    private createDay = (dayList: CookieAdvancedTypes[])=>{
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
            if(this.machine.length === 1){
                const machineMatchup = this.GetSecondCookieForTheMachine(this.machine[0])
                const cookieSelection = machineMatchup.sort(this.sortByPercentageNeeds)[0]
                this.machine.push(cookieSelection)
            }else if(this.machine.length === 0){
                const cookieMostNeeded = this.allCookies.filter(cookie=>cookie.cookie_ismachine).sort(this.sortByPercentageNeeds)[0]
                const machineMatchup = this.GetSecondCookieForTheMachine(cookieMostNeeded)
                let cookieSelection = machineMatchup.sort(this.sortByPercentageNeeds)[0]
                this.machine.push(cookieMostNeeded, cookieSelection)
            }
        }

        const machineEndCookies = this.machine.filter(cookie=>cookie.cookie_isendchain)
        if(machineEndCookies.length > 1){
            //Good
            const chosenCookie = machineEndCookies.sort(this.sortByPercentageNeeds)
            chosenCookie.forEach((cookie, index)=>{
                if(index < 1) return
                const indexInTheMachine = this.machine.findIndex(machineCookie=>cookie.cookie_id === machineCookie.cookie_id)
                this.hand.push(this.machine[indexInTheMachine])
                this.machine.splice(indexInTheMachine, 1)
            })
        }

        const machineMap = this.machine.map(cookie=>{
            const currentCookie = this.allCookies.find(dbCookie=>cookie.cookie_id === dbCookie.cookie_id)
            if(!currentCookie) return
            const stockPercentage = (currentCookie.cookie_amount / currentCookie.cookie_packaging / currentCookie.needed) * 100
            const remainCookies = currentCookie.needed * (Math.ceil(130 - stockPercentage))
            let todoInGrams = Math.ceil(remainCookies / this.kilo) * this.dough
            let doingInFact = todoInGrams / currentCookie.cookie_weight
            
            if(todoInGrams < 1){
                doingInFact = this.dough / currentCookie.cookie_weight
                todoInGrams = this.dough
            }
            
            currentCookie.cookie_amount += doingInFact
            return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: `${todoInGrams / this.kilo} KG`}
        })
        
        const handMap = this.hand.map(cookie=>{
            const currentCookie = this.allCookies.find(dbCookie=>cookie.cookie_id === dbCookie.cookie_id)
            if(!currentCookie) return
            if(this.hand.length < 1){
                const [amountInKilos, amountInPieces] = this.CalculateWeight(currentCookie)
                currentCookie.cookie_amount += amountInPieces
                return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: `${amountInKilos} KG`}
            }
            const pieces = (this.dough / (cookie.cookie_packaging * cookie.cookie_weight)) * cookie.cookie_packaging
            currentCookie.cookie_amount += pieces
            return {id: currentCookie.cookie_id, name: currentCookie.cookie_name, amount: `${this.dough / this.kilo} KG`} 
        })
            
        this.list.push(machineMap.concat(handMap))
    }
            
    private CookieCalculation = (day: number):()=>void =>{
        if(day > 4) return ()=>{}
        const cookieDayList: CookieAdvancedTypes[] = []
        for(const cookie of this.sheetData){
            const id = cookie[process.env.NODE_ENV === "development" ? cookie.length - 2 : cookie.length - 1]
            const cookieInfos = this.allCookies.find(cookie=>cookie.cookie_id === id)
            const cookieDayByDay = cookie.slice(1, cookie.length - 2)
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

    private sortByPercentageNeeds = (a:CookieAdvancedTypes, b:CookieAdvancedTypes):number=>{
        const firstCookie = (a.cookie_amount / a.cookie_packaging) / (a.needed + (a.cookie_threshold / a.cookie_packaging)) * 100
        const secondCookie =(b.cookie_amount / b.cookie_packaging) / (b.needed + (b.cookie_threshold / b.cookie_packaging)) * 100
        return firstCookie - secondCookie

    }

    private CookieAsked = (cookie: any[], currentPosition: number, end: number, result: number[]):number[]=>{
        if(end === currentPosition) return result
        return this.CookieAsked(cookie, currentPosition + 1, end, result)
    }

    private GetSecondCookieForTheMachine = (selectedCookie: CookieAdvancedTypes)=>{
        if(selectedCookie.cookie_isendchain){
            return this.allCookies.filter(cookie=>selectedCookie.category_family === cookie.category_family && selectedCookie.cookie_id !== cookie.cookie_id && selectedCookie.cookie_isendchain !== cookie.cookie_isendchain)
        }else{
            return this.allCookies.filter(cookie=>selectedCookie.category_family === cookie.category_family && selectedCookie.cookie_id !== cookie.cookie_id)

        }
    }

    private CalculateWeight = (cookie: CookieAdvancedTypes)=>{
        const totalInGram = Math.ceil(cookie.cookie_packaging * cookie.cookie_weight * (cookie.needed + (cookie.cookie_threshold / cookie.cookie_packaging)) / this.dough) * this.dough
        const cookieBoxWeight = cookie.cookie_packaging * cookie.cookie_weight
        const kilos = totalInGram / this.kilo
        const piecesAmount = (totalInGram / cookieBoxWeight) * cookie.cookie_packaging
        return [kilos, piecesAmount]
    }
}
    
export default Machine
    