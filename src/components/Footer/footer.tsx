
import Link from "next/link"
import styles from "./styles.module.css"

interface FooterProps {}

const Footer:React.FC<FooterProps> = ()=>{

    return (
        <footer className={styles.footer}>
            <div>
                <Link href="/stock">Stock</Link>
            </div>
        </footer>
    )
}

export default Footer