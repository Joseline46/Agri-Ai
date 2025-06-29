import { useState } from 'react'

import { Store, Tractor, Library, UsersRound, LogOut, PanelRightOpen, HandCoins, UserRoundPlus, Plus } from 'lucide-react'

import styles from './sidebar.module.css'

const Sidebar = (props)=> {
    return (
        <section className={styles.sidebar}>
            <section className={styles.header}>
                <p className={styles.logo}>Agri-AI</p>
                <PanelRightOpen color='#000000' size={20} />
            </section>
            <section className={styles.nav}>
                <p className={styles.smText}>Quick Links</p>
                <section className={styles.navLinks}>
                    <section className={styles.link} onClick={()=>props.setShowAddUserForm((prevState)=>!prevState)}>
                        <Plus size={17} color='black' /> &nbsp;&nbsp;Register Farmer
                    </section>
                    <section className={styles.link}>
                        <UserRoundPlus size={17} color='black' /> &nbsp;&nbsp;Register User
                    </section>
                    <section className={styles.link} onClick={()=>props.recordGrainSale()}> 
                        <HandCoins size={17} color='black' />&nbsp;&nbsp;Record Sale
                    </section>
                </section>
            </section>

            <section className={styles.nav}>
                <p className={styles.smText}>Main Menu</p>
                <section className={styles.navLinks}>
                    <section className={styles.link}>
                        <Tractor size={17} color='black' /> &nbsp;&nbsp;Farmers
                    </section>
                    <section className={styles.link}>
                        <Store size={17} color='black' /> &nbsp;&nbsp;Inventory
                    </section>
                    <section className={styles.link}>
                        <UsersRound size={17} color='black' />&nbsp;&nbsp;Users
                    </section>
                    <section className={styles.link}>
                        <Library size={17} color='black' />&nbsp;&nbsp;Reports
                    </section>
                </section>
            </section>

            <section className={styles.footer}>
                <section className={styles.profile}>
                    <section className={styles.avatar}>
                    </section>
                    <section className={styles.credentials}>
                        <p className={styles.title}>Account User</p>
                        <p className={styles.username}>{props.credentials.email}</p>
                    </section>
                </section>
                <button className={styles.signout} onClick={()=>props.signout()}>
                    <LogOut size={17} color='black' />&nbsp;Sign Out
                </button>
            </section>
        </section>
    )
}

export default Sidebar