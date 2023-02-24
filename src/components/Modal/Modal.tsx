
import { useEffect, useState } from "react"
import styles from "./styles.module.css"

interface ModalProps {
    state: boolean,
    children: JSX.Element,
    className?: string,
    onModalStateChange?: (state: boolean)=> void
}

const Modal:React.FC<ModalProps> = ({children, className, state, onModalStateChange})=>{

    return (
        <div className={`${styles.modal}`}>
            <div className={styles.modal_bg} onClick={()=>onModalStateChange && onModalStateChange(!state)} />
            <div className={`${styles.modal_content} ${className}`}>
                {children}
            </div>
        </div>
    )
}

export default Modal