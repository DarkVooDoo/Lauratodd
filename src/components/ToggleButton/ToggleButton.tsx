import { useState } from "react"
import styles from "./styles.module.css"

interface ToggleButtonProps {
    state: boolean,
    onChange?: (state: boolean) => void
}

const ToggleButton:React.FC<ToggleButtonProps> = ({state, onChange})=>{
    const [toggleState, setToggleState] = useState(state)

    const onToggleChange = ()=>{
        setToggleState(prev=>!prev)
        if(!onChange) return
        onChange(!toggleState)
    }
    return (
        <button className={`${styles.toggle} ${toggleState && styles.toggle_on_color}`} onClick={onToggleChange}>
            <div className={`${styles.toggle_state} ${toggleState && styles.toggle_on}`} />
        </button>
    )
}

export default ToggleButton