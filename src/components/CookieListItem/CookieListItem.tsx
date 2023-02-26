import Image from "next/image"

import styles from "./styles.module.css"
interface ProdResumeListProps {
    id: string,
    name: string,
    amount: number,
    className?: string,
    onEdit?: (id: string)=> void,
    onRemove?: (id: string)=> void
}
 
const ProdResumeList:React.FC<ProdResumeListProps> = ({name, amount, id, onRemove, onEdit, className})=>{

    return (
        <div className={`${styles.prod_list_item} ${className}`}>
            <div className={styles.prod_list_item_content} onClick={()=>onEdit && onEdit(id)}>
                <p className={styles.prod_list_item_name}>{name} </p>
                <p className={styles.prod_list_item_amount}><b>Qté: </b>{amount} Piéces </p>
            </div>
            <div className={styles.prod_list_item_actions}>
                <div className={styles.prod_list_item_actions_btn} onClick={()=>onRemove && onRemove(id)}>
                    <Image src={"trash.svg"} alt="delete" height={25} width={25} />
                </div>
            </div>
     
        </div>
    )
}

export default ProdResumeList