import { FormEventHandler, useState } from "react"
import Head from "next/head"
import { GetServerSideProps } from "next"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons"

import {DropdownTypes, CookieTypes, ProductionTypes} from "@/helpers/types"
import { onSubmit ,onRoomChange } from "@/controllers/production.controller"

import Dropdown from "@/components/Dropdown/Dropdown"
import CookieListItem from "@/components/CookieListItem/CookieListItem"
import Modal from "@/components/Modal/Modal"

import styles from "./styles.module.css"
interface ProductionProps {
    rooms: DropdownTypes,
    dropdownCookies: DropdownTypes,
    cookies: CookieTypes[],
    room: string | undefined

}

const Production:React.FC<ProductionProps> = ({rooms, dropdownCookies, cookies, room})=>{

    const [currentRoom, setCurrentRoom] = useState(room ? room : "Prod")
    const [currentCookie, setCurrentCookie] = useState({id: cookies[0].cookie_id, name: cookies[0].cookie_name, packaging: cookies[0].cookie_packaging})
    const [newCookie, setNewCookie] = useState<{id: string, piece: string, bac: string}>({id: "", piece: "0", bac: "0"})
    const [list, setList] = useState<Map<string, ProductionTypes>>(new Map())
    const [modal, setModal] = useState(false)

    const onAddCookie:FormEventHandler = (e)=>{
        e.preventDefault()
        const amount = parseInt(newCookie?.bac || "0") * currentCookie.packaging + parseInt(newCookie?.piece || "0")
        if(amount < 1) return
        list.set(currentCookie.id, {id: currentCookie.id, name: currentCookie.name, amount, piece: parseInt(newCookie.piece), bac: parseInt(newCookie.bac)})
        setList(new Map(list.entries()))
        setNewCookie({bac: "0", piece: "0", id: currentCookie.id})
    }

    const listOfCookies = Array.from(list.values()).map((cookie, index)=><CookieListItem key={Math.random()} 
    {...{...cookie, 
        index, 
        className: currentRoom === "Cuisson" ? "warning" : "good", 
        onEdit: (id)=>{
            const cookie = list.get(id)
            const dropdownCookie = cookies.find(cookie=>cookie.cookie_id === id)
            setCurrentCookie({id, name: dropdownCookie!.cookie_name, packaging: dropdownCookie!.cookie_packaging})
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
                        id: "rooms",
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
                            id: "cookies",
                            items: dropdownCookies, 
                            className: `${styles.prod_cookieSelection_name}`,
                            onChange: (id, name)=>setCurrentCookie({id, name, packaging: cookies[cookies.findIndex(item=>item.cookie_id === id)].cookie_packaging})
                        }} />
                        <form className={styles.prod_modal_content_form} onSubmit={onAddCookie}>
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
                                <button type="button" className={`${styles.prod_modal_buttons_btn} ${styles.cancel_btn}`} onClick={()=>{setModal(false)}}>Non</button>
                                <button type="submit" className={`${styles.prod_modal_buttons_btn} ${styles.confirm_btn}`} onClick={onAddCookie}>Oui</button>
                            </div>
                        </form>
                    </div>
                </Modal>}
            </main>
        </>
        
    )
}

export const getServerSideProps:GetServerSideProps = async ({req})=>{
    const fetchData = await fetch(`${process.env.URL}/api/production`)
    const data = await fetchData.json() as {room: DropdownTypes, cookies: CookieTypes[]}
    const {room} = req.cookies
    return {
        props: {...data, room}
    }
}

export default Production