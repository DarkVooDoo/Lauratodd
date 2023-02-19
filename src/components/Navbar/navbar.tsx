import Link from "next/link"
import { useState } from "react"

import styles from "./styles.module.css"

const ROUTES = [{route: "/stock", label: "Stock"}, {route: "/prod", label: "Production"}, {route: "/prod-calculation", label: "Calculation"}]

const Navbar = ()=>{

  const [display, setDisplay] = useState(false)

  const links = ROUTES.map(link=>(<Link key={link.route} href={link.route} className={styles.nav_menu_links_row}>{link.label} </Link>))

    return (
        <nav className={styles.nav}>
          <Link href={"/"} className={styles.nav_link}>Home</Link>
          <button className={styles.nav_menu} onClick={()=>setDisplay(!display)}>
            <div className={`${styles.nav_menu_bar}`} />
            <div className={`${styles.nav_menu_bar}`} />
            <div className={`${styles.nav_menu_bar}`} />
            <div 
            className={`${styles.nav_menu_links}`} 
            style={{height: `${display ? `calc(var(--Navbar_Link_Height) * ${ROUTES.length})` : "0px"}`}}>
              {links}
            </div>
          </button>
        </nav>
    )
}

export default Navbar