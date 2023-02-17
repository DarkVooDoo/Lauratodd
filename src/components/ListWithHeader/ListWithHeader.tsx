
import styles from "./styles.module.css"

interface ListWithHeaderProps {
    headers: string[]
    children: JSX.Element
}

const ListWithHeader:React.FC<ListWithHeaderProps> = ({headers, children})=>{

    const myHeaders = headers.map((item, index, array)=>{
        let isLargeScreen = ""
        if(index > 0 && index < array.length - 1) isLargeScreen = styles.large_screen
        return (
            <div key={Math.random()} className={`${isLargeScreen}`} >
                <p>{item}</p>
            </div>
        )
    })
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