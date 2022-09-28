import React, {useEffect, useState} from 'react';
import DatePicker from "../DatePicker/DatePicker";

import {useStore} from "effector-react";
import {getNewReq, $newReqStatus} from "../../state";
import styles from './TechControl.module.scss'

import Nav from "../Nav/Nav";
import {$firstTime, $secondTime} from "../../state/techTIme";

import TaskItem from "../TaskItem/TaskItem";

import {$scrollY, setScrollY} from "../../state/scrollY";
import TaskListWrapper from "./TaskListWrapper";
import {$selected, cleareSelected} from "../../state/longTouch";

import Close from '../../img/close.png'
import ChangeTechWrapper from "./ChangeTech";
import {setShowTask} from "../../state/showTask";


import {$graphData, getData} from "../../state/GraphTask";
import {$techsStatus, $techStatus, getStatus, getTechs} from "../../state/Techs";
import {$planeStatus, $selectedUser, getPlane, setSelectedUser} from "../../state/plane";

const TechControl = () => {

    const [refresh, setRefresh] = useState(false);

    const test = useStore($newReqStatus);

    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);

    const sel= useStore($selected);
    const [change, setChange] = useState(false)
    useEffect(() => {
        getNewReq({'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + firstTime.getDate() : firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth()+1) : secondTime.getMonth()+1 }-${secondTime.getDate() <= 9 ? '0' + secondTime.getDate() : secondTime.getDate()} 00:00:01`});


        getData(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);        getData(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);
        getStatus(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);        getData(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);
        getPlane(firstTime)
        getTechs(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`)

        setScrollY(0)
    }, [refresh])


    return (
        <div style={{position: 'relative'}}>
            {sel.length ? <div className={styles.closeSel}><img src={Close} alt="" onClick={() => {
                cleareSelected()
                setScrollY(0)
                setChange(false)
            }}/></div> : null}
            <DatePicker get={getNewReq}/>
            <Nav setRefresh={setRefresh}/>
            <TaskListWrapper  sel={sel}>
                {test.map((el, i) => <TaskItem task={el} key={i} i={i} />)}
            </TaskListWrapper>
            {sel.length ? <p className={styles.changeTech} onClick={() => setChange(true)}>Передать</p> : null}

            {change ? <ChangeTechWrapper func={() => setChange(false)}/> : null}
        </div>

    );
}



export default TechControl;
