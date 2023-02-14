
import styles from "./styles.module.css"

const Name = ()=>{

    return (
        <div className={styles.loading}>
            <div className={`${styles.loading_dot} ${styles.loading_dot1}`} />
            <div className={`${styles.loading_dot} ${styles.loading_dot2}`} />
            <div className={`${styles.loading_dot} ${styles.loading_dot3}`} />
        </div>
    )
}

export default Name