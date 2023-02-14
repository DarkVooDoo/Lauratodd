
import styles from "./styles.module.css"

interface FooterProps {}

const Footer:React.FC<FooterProps> = ()=>{

    return (
        <footer className={styles.footer}>
            <p>Hello</p>
        </footer>
    )
}

export default Footer