import React, {useEffect, useRef, useState} from 'react';
import styles from './Search.module.scss'
import Close from '../../img/close.png'
import SearchImg from '../../img/search.png'
import {$searchInput, getReq, setSearch, setSearchInput, $reqStatus, $checkBox, setCheckBox} from "../../state/Search";
import {useStore} from "effector-react";
import Moment from "react-moment";

import {setScrollY} from "../../state/scrollY";
import SearchItemsWrapper from "./SearchItemsWrapper";
import {setShowTask} from "../../state/showTask";
import {$usersStatus} from "../../state/getUsers";
import {filterTaskCust} from "../../utils/filterTaskCust";
import {getLastName} from "../../utils/getLastName";
import TaskItem from "../TaskItem/TaskItem";


const Search = () => {
    const input = useStore($searchInput)
    const req = useStore($reqStatus)
    const checkBox = useStore($checkBox)
    const deps = useStore($usersStatus);



    useEffect(() => {
        setScrollY(0)
    }, [])

    return (
       <div>
                <header className={styles.headerWrapper}>
                    <div className={styles.searchHeader}>
                        <img src={SearchImg} alt="" className={styles.searchImg}/>
                        <input type="text" placeholder="Введите ключевое слово, минимум 3 символа" autoFocus={true} value={input} onChange={(e) => setSearchInput(e.target.value)}/>
                        <img src={Close} alt="" onClick={() => {
                            setSearchInput('')
                            setSearch(false)
                        }}/>
                    </div>
                    <div className={styles.legend}>
                        <label><input type="checkbox" checked={checkBox} onChange={(e) => setCheckBox(e.target.checked)} />Мои</label>

                        <div className={styles.legendWrapper}>
                            <div className={`${styles.circle2} ${styles.blue}`}></div>
                            <p>Новая</p>
                        </div>
                        <div className={styles.legendWrapper}>
                            <div className={`${styles.circle2} ${styles.orange}`}></div>
                            <p>В работе</p>
                        </div>
                        <div className={styles.legendWrapper}>
                            <div className={`${styles.circle2} ${styles.green}`}></div>
                            <p>Выполнено</p>
                        </div>

                    </div>
                </header>

                <SearchItemsWrapper  >
                    {req.map((el, i) => {
                        return <TaskItem task={el} key={el[0]} i={i}/>

                    })}
                </SearchItemsWrapper>
            </div>
    );
}



export default Search;
