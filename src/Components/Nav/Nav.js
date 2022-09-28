import React, {useState} from 'react';
import styles from './Nav.module.scss'
import {useStore} from "effector-react";
import {$nav, setNav} from "../../state/Nav";
import TypeNav from "./TypeNav";

import {$counters} from "../../state";

import {setCreateTask} from "../../state/createTaskState";


const Nav = ({setRefresh}) => {
    const nav = useStore($nav);
    const count = useStore($counters);


    return (
        <div>

            <div className={styles.createTask}>
                <button onClick={() => {
                  setRefresh(prev => !prev);
                  setCreateTask(true);
                  }}>+</button>
            </div>
            <div className={styles.navWrapper}>
                    <ul>
                        {/*<p style={{textAlign: "center", fontWeight: 500}}>Всего: {count.req+count.mon+count.dem+count.so+count.to+count.pre} - <span style={{color:"red"}}>{notComp.req+notComp.mon+notComp.dem+notComp.so+notComp.to+notComp.pre}</span></p>*/}
                        <li style={{background: "white", border: "none"}}>{count.NEW.so + count.NEW.mon + count.NEW.dem } - <span style={{color:"green"}}>{count.COMP.so + count.COMP.mon + count.COMP.dem }</span> - <span style={{color:"red"}}>{count.NC.so + count.NC.mon + count.NC.dem }</span></li>
                        <li className={nav === 'so' ? styles.active : null} onClick={() => {
                            setNav('so')
                        }}><p>{count.NEW.so} - <span style={{color:"green"}}>{count.COMP.so}</span> - <span style={{color:"red"}}>{count.NC.so}</span></p><p>(СО) </p></li>
                        <li className={nav === 'mon' ? styles.active : null} onClick={() => {
                            setNav('mon')
                        }}><p>{count.NEW.mon} - <span style={{color:"green"}}>{count.COMP.mon}</span> - <span style={{color:"red"}}>{count.NC.mon}</span></p><p>(М)онтажи </p></li>
                        <li className={nav === 'dem' ? styles.active : null} onClick={() => {
                            setNav('dem')
                        }}><p>{count.NEW.dem} - <span style={{color:"green"}}>{count.COMP.dem}</span> - <span style={{color:"red"}}>{count.NC.dem}</span></p><p>(Д)емонтажи  </p></li>
                        <li className={nav === 'corp' ? styles.active : null} onClick={() => {
                                    setNav('corp')
                                }}><p>{count.NEW.corp} - <span style={{color:"green"}}>{count.COMP.corp}</span> - <span style={{color:"red"}}>{count.NC.corp}</span></p><p>Сетевые</p></li>


                    </ul>

                <ul>
                    {/*<p style={{textAlign: "center", fontWeight: 500}}>Всего: {count.req+count.mon+count.dem+count.so+count.to+count.pre} - <span style={{color:"red"}}>{notComp.req+notComp.mon+notComp.dem+notComp.so+notComp.to+notComp.pre}</span></p>*/}
                    <li style={{background: "white", border: "none"}}>{count.NEW.connection + count.NEW.repeats } - <span style={{color:"green"}}>{count.COMP.connection + count.COMP.repeats }</span> - <span style={{color:"red"}}>{count.NC.connection + count.NC.repeats }</span></li>
                    <li className={nav === 'connection' ? styles.active : null} onClick={() => {
                        setNav('connection')
                    }}><p>{count.NEW.connection} - <span style={{color:"green"}}>{count.COMP.connection}</span> - <span style={{color:"red"}}>{count.NC.connection}</span></p><p>Нет (КС)</p></li>
                    <li className={nav === 'repeats' ? styles.active : null} onClick={() => {
                        setNav('repeats')
                    }}><p>{count.NEW.repeats} - <span style={{color:"green"}}>{count.COMP.repeats}</span> - <span style={{color:"red"}}>{count.NC.repeats}</span></p><p>(П)овторы </p></li>
                    <li className={nav === 'deffect' ? styles.active : null} onClick={() => {
                        setNav('deffect')
                    }}><p>{count.NEW.deffect} - <span style={{color:"green"}}>{count.COMP.deffect}</span> - <span style={{color:"red"}}>{count.NC.deffect}</span></p><p>Брак </p></li>
                    <li className={nav === 'preP' ? styles.active : null} onClick={() => {
                        setNav('preP')
                    }}><p>{count.NEW.preP} - <span style={{color:"green"}}>{count.COMP.preP}</span> - <span style={{color:"red"}}>{count.NC.preP}</span></p><p>(ПР) от Пульта</p></li>
                </ul>
                    <ul>
                        <li style={{background: "white", border: "none"}}>{count.NEW.req + count.NEW.pre + count.NEW.toM + count.NEW.toQ} - <span style={{color:"green"}}>{count.COMP.req + count.COMP.pre + count.COMP.toM + count.COMP.toQ}</span> - <span style={{color:"red"}}>{count.NC.req + count.NC.pre + count.NC.toM + count.NC.toQ}</span></li>
                        <li className={nav === 'req' ? styles.active : null} onClick={() => {
                            setNav('req')

                        }}><p>{count.NEW.req} - <span style={{color:"green"}}>{count.COMP.req}</span> - <span style={{color:"red"}}>{count.NC.req}</span></p><p>(З)аявки </p></li>
                        <li className={nav === 'pre' ? styles.active : null} onClick={() => {
                            setNav('pre')

                        }}><p>{count.NEW.pre} - <span style={{color:"green"}}>{count.COMP.pre}</span> -<span style={{color:"red"}}>{count.NC.pre}</span></p><p>(ПР)етензии </p></li>
                        <li className={nav === 'toM' ? styles.active : null} onClick={() => {
                            setNav('toM')

                        }}><p>{count.NEW.toM} - <span style={{color:"green"}}>{count.COMP.toM}</span> -<span style={{color:"red"}}>{count.NC.toM}</span></p><p>ТО (М)</p></li>
                        <li className={nav === 'toQ' ? styles.active : null} onClick={() => {
                            setNav('toQ')

                        }}><p>{count.NEW.toQ} - <span style={{color:"green"}}>{count.COMP.toQ}</span> -<span style={{color:"red"}}>{count.NC.toQ}</span></p><p>ТО (К)</p></li>
                    </ul>
                </div>

            <TypeNav/></div>

    );
}



export default Nav;
