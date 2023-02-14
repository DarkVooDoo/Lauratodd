interface ProdResumeListProps {
    index: number,
    cookie_name: string,
    cookie_amount: number,
    className?: string,
    onRemove?: (index: number)=> void
}

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash, faPenToSquare} from "@fortawesome/free-solid-svg-icons"
 
import styles from "./styles.module.css"

const ProdResumeList:React.FC<ProdResumeListProps> = ({cookie_name, cookie_amount, index, onRemove, className})=>{

    return (
        <div className={`${styles.prod_list_item} ${className}`}>
            <div className={styles.prod_list_item_content}>
                <p className={styles.prod_list_item_name}>{cookie_name} </p>
                <p className={styles.prod_list_item_amount}><b>Qté: </b>{cookie_amount} Piéces </p>
            </div>
            <div className={styles.prod_list_item_actions}>
                <div className={styles.prod_list_item_actions_btn} onClick={()=>onRemove && onRemove(index)}>
                    <FontAwesomeIcon {...{icon: faTrash, size: "1x"}} />
                </div>
                <div className={styles.prod_list_item_actions_btn}>
                    <FontAwesomeIcon {...{icon: faPenToSquare, size: "1x"}} />
                </div>
            </div>
        </div>
    )
}

export default ProdResumeList