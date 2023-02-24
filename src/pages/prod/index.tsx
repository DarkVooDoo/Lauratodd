import { useState } from "react"
import Head from "next/head"
import { GetServerSideProps } from "next"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons"

import {DropdownTypes, CookieTypes, ProductionTypes} from "@/helpers/types"
import { onSubmit ,onRoomChange, onUnitChange } from "@/controllers/production.controller"

import Dropdown from "@/components/Dropdown/Dropdown"
import TextInput from "@/components/TextInput/TextInput"
import CookieListItem from "@/components/CookieListItem/CookieListItem"
import Modal from "@/components/Modal/Modal"

import styles from "./styles.module.css"
interface ProductionProps {
    rooms: DropdownTypes,
    dropdownCookies: DropdownTypes,
    cookies: CookieTypes[],
    room: string | undefined,
    unit: string | undefined

}

const Production:React.FC<ProductionProps> = ({rooms, dropdownCookies, cookies, room, unit})=>{
    const units = ["Bac", "Piece"]

    const [unitType, setUnitType] = useState(unit ? unit : units[0])
    const [currentRoom, setCurrentRoom] = useState(room ? room : "Prod")
    const [currentCookie, setCurrentCookie] = useState({id: cookies[0].cookie_id, name: cookies[0].cookie_name, packaging: cookies[0].cookie_packaging})
    const [newCookie, setNewCookie] = useState<{id: string, piece: string, bac: string}>({id: "", piece: "0", bac: "0"})
    const [list, setList] = useState<Map<string, ProductionTypes>>(new Map())
    const [modal, setModal] = useState(false)

    const unitTypes = units.map(item=>(
        <div key={Math.random()}>
            <label htmlFor={item}>{item} </label>
            <input type="radio" name="unit" id={item} checked={unitType === item} onChange={({currentTarget:{id}})=>setUnitType(onUnitChange(id))} />
        </div>
    ))

    const listOfCookies = Array.from(list.values()).map((cookie, index)=><CookieListItem key={Math.random()} 
    {...{...cookie, 
        index, 
        className: currentRoom === "Cuisson" ? "warning" : "good", 
        onEdit: (id)=>{
            const cookie = list.get(id)
            setNewCookie({id: cookie?.id || "", piece: cookie?.piece.toString() || "0", bac: cookie?.bac.toString() || "0"})
            setModal(true)
        },
        onRemove: (id)=>{
            list.delete(id)
            setList(new Map(list.entries()))
        }}
    } />)
    return (
        <>
            <Head>
                <title>Prod</title>
                <meta name="description" content="Laura todd day production" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className={styles.prod_header}>
                    <h1>Production</h1>
                    <Dropdown {...{
                        value: currentRoom, 
                        items: rooms, 
                        className: `${styles.prod_header_room}`, 
                        onChange: (_, value)=>{
                        setCurrentRoom(onRoomChange(value))
                    }}} />
                </div>
                <div className={styles.prod_actions}>
                    <button className={styles.prod_actions_newBtn} onClick={()=>setModal(true)}>Ajouter un cookie</button>
                    <button className={styles.prod_actions_saveBtn} onClick={()=>{
                        onSubmit(currentRoom, list)
                    }}><Icon icon={faCloudArrowUp} size="1x" /></button>
                </div>
                {listOfCookies}
                
                {modal && <Modal {...{state: modal, className: styles.prod_modal, onModalStateChange: (state)=>{
                    setModal(state)
                    if(list.get(currentCookie.id)?.amount! < 1){
                        list.delete(currentCookie.id)
                        setList(new Map(list.entries()))
                    }
                    }}}>
                    <div className={styles.prod_modal_content}>
                        <h3 className={styles.prod_modal_content_header}>Ajouter un cookie</h3>
                        <Dropdown {...{
                            value: currentCookie.name, 
                            items: dropdownCookies, 
                            className: `${styles.prod_cookieSelection_name}`,
                            onChange: (id, name)=>setCurrentCookie({id, name, packaging: cookies[cookies.findIndex(item=>item.cookie_id === id)].cookie_packaging})
                        }} />
                        <label htmlFor="bac">Nombre de bacs</label>
                        <div className={styles.prod_edit_field}>
                            <input type="number" name="bac" id="bac" className={styles.prod_edit_field_input} value={newCookie?.bac} onChange={({target:{value}})=>{
                                setNewCookie({id: currentCookie.id, bac: value, piece: newCookie?.piece || "0"})
                            }} />
                        </div>
                        <label htmlFor="piece">Nombre de pieces</label>
                        <div className={styles.prod_edit_field}>
                            <input type="number" name="piece" id="piece" className={styles.prod_edit_field_input} value={newCookie?.piece} onChange={({target:{value}})=>{
                                setNewCookie({id: currentCookie.id, bac: newCookie?.bac || "0", piece: value})
                            }} />
                        </div>
                        <div className={styles.prod_modal_buttons}>
                            <button className={`${styles.prod_modal_buttons_btn} ${styles.cancel_btn}`} onClick={()=>{setModal(false)}}>Non</button>
                            <button className={`${styles.prod_modal_buttons_btn} ${styles.confirm_btn}`} onClick={()=>{
                                const amount = parseInt(newCookie?.bac || "0") * currentCookie.packaging + parseInt(newCookie?.piece || "0")
                                if(amount < 1) return
                                list.set(currentCookie.id, {id: currentCookie.id, name: currentCookie.name, amount, piece: parseInt(newCookie.piece), bac: parseInt(newCookie.bac)})
                                setList(new Map(list.entries()))
                                setModal(false)
                            }}>Oui</button>
                        </div>
                    </div>
                </Modal>}
            </main>
        </>
        
    )
}

export const getServerSideProps:GetServerSideProps = async ({req})=>{
    const fetchData = await fetch(`http://localhost:3000/api/production`)
    const data = await fetchData.json() as {room: DropdownTypes, cookies: CookieTypes[]}
    const {room, unit} = req.cookies
    return {
        props: {...data, room, unit}
    }
}

export default Production