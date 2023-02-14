import Link from "next/link"

import styles from "./styles.module.css"

const Navbar = ()=>{

    return (
        <nav className={styles.nav}>
          <Link href={"/"} className={styles.nav_link}>Home</Link>
          <div className={styles.nav_menu}>

          </div>
        </nav>
    )
}

export default Navbar