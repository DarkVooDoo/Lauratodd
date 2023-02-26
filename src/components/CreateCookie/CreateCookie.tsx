import { FormEventHandler, useEffect, useMemo, useState } from "react"

import ToggleButton from "../ToggleButton/ToggleButton"

import styles from "./styles.module.css"

interface CreateCookieProps {
    category: string[],
    onSuccess: ()=> void
}

const CreateCookie:React.FC<CreateCookieProps> = ({category, onSuccess})=>{

    const [cookie, setCookie] = useState<{[key: string]: {content: string, type?: "text" | "number"}}>({
        Nom: {content: ""}, 
        Quantite: {content: "0", type: "number"},
        Poids: {content: "50", type: "number"}, 
        Packaging: {content: "100", type: "number"}, 
        Marge: {content: "100", type: "number"}
    })
    const [isMachine, setIsMachine] = useState(true)
    const [onMenu, setOnMenu] = useState(true)
    const [family, setFamily] = useState(new Set())

    const onCookieCreation:FormEventHandler = async (e)=>{
        e.preventDefault()
        const createCookie = await fetch(`/api/cookie`, {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({
                name: cookie.Nom.content, 
                amount: cookie.Quantite.content,
                weight: cookie.Poids.content,
                packaging: cookie.Packaging.content,
                threshold: cookie.Marge.content,
                isMachine, 
                onMenu,
                family: Array.from(family)
            })
        })
        if(createCookie.status === 200) onSuccess()        
    }

    const inputs = Object.entries(cookie).map(item=>{
        const [key, values] = item
        return (
            <TextInput key={key} {...{name: key, value: values.content, type: values.type, onChange: (name, value)=>setCookie(prev=>({...prev, [name]: {content: value, type: values.type}}))}} />
        )
    })

    const myCategorys = category.map(category=>(
        <div key={Math.random()} className={styles.create_form_category_checkbox}>
            <input type="checkbox" name={category} id={category} checked={family.has(category)} onChange={({target:{checked, name}})=>{
                if(checked){
                    family.add(name)
                    setFamily(new Set(family))
                }else{
                    family.delete(name)
                    setFamily(new Set(family))
                }
            }} />
            <label htmlFor={category}>{category}</label>
        </div>
    ))

    return (
        <div className={styles.create}>
            <h3 className={styles.create_header}>Ajouter un cookie</h3>  
            <form onSubmit={onCookieCreation} id="cookie_creation" className={styles.create_form}>
                <div className={styles.create_form_category}>
                    {myCategorys}
                </div>
                <div className={styles.create_columns}>
                    <div>
                        <p>Dans la machine</p>
                        <ToggleButton {...{state: isMachine, onChange: (state)=>setIsMachine(state)}} />
                    </div>
                    <div>
                        <p>Dans le menu</p>
                        <ToggleButton {...{state: onMenu, onChange: (state)=>setOnMenu(state)}} />
                    </div>
                </div>  
                {inputs}                
            </form>   
            <button type="submit" form="cookie_creation" className={styles.create_btn}>Creer</button>
        </div>
    )
}

const TextInput = ({name, value, type = "text", onChange}:{name: string, value: string, type?: "text" | "number", onChange: (name: string, value: string)=>void})=>{
    return (
        <div className={styles.create_field}>
            <div>{name} </div>
            <input 
            type={type} 
            name={name} 
            autoComplete="off"
            id={name}
            className={styles.create_field_input} 
            value={value || ""} 
            onChange={({target:{name, value}})=>{
                onChange(name, value)
            }} />
        </div>
    )
}

export default CreateCookie