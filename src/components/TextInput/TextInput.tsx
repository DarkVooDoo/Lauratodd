"use client"

import { useState } from "react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons"

import styles from "./styles.module.css"

interface test {
    onConfirm: (payload: string)=> void
    type?: "text" | "number"
}

const TextInput:React.FC<test> = ({type = "text", onConfirm})=>{

    const [value, setValue] = useState("0")

    return (
        <div className={styles.container}>
            <div className={styles.container_input}>
                <input className={styles.container_input_field} type={type} autoComplete="off" name="amount" id="amount" required value={value}
                onKeyDown={({key})=>{
                    if(key !== "Enter" || parseInt(value) < 1 || !value) return
                    onConfirm(value ? value : "0")
                    setValue("")
                }} 
                onChange={({target:{value}})=>setValue(value)} />
                <label className={styles.container_input_label} htmlFor="amount">Quantité </label>
            </div>
            <div className={styles.container_sendBtn}>
                <FontAwesomeIcon icon={faPaperPlane} size="1x" onClick={()=>{
                    onConfirm(value ? value : "0")
                    setValue("")
                }} />
            </div>
        </div>
    )
}

export default TextInput