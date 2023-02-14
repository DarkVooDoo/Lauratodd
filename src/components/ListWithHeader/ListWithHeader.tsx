
import styles from "./styles.module.css"

interface ListWithHeaderProps {
    headers: string[]
    children: JSX.Element
}

const ListWithHeader:React.FC<ListWithHeaderProps> = ({headers, children})=>{

    const myHeaders = headers.map(item=>(
        <div key={Math.random()} className={styles.list_headers_name} >
            <p>{item}</p>
        </div>
    ))
    return (
        <div className={styles.list}>
            <div className={styles.list_headers}>
                {myHeaders}
            </div>  
            <div className={styles.list_content}>
                {children}
            </div>
        </div>
    )
}

export default ListWithHeader