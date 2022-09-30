import React, {useEffect, useState, useRef} from 'react';
import styles from './TaskItem.module.scss';
import {useStore} from "effector-react";
import Brak from '../../img/closered.png'
import {$usersStatus} from "../../state/getUsers";
import {filterTaskCust} from "../../utils/filterTaskCust";
import {getLastName} from "../../utils/getLastName";
import {setScrollY} from "../../state/scrollY";
import {setShowTask} from "../../state/showTask";
import moment from "moment";
import {getHistoryType} from "../../utils/history_type";


const TaskItem = ({task, i, func, history}) => {
    const deps = useStore($usersStatus);
    let json_history;
    try {
        let hson = task[52] ? JSON.parse(task[52]) : []

        json_history = hson.length ? hson.flat(1) : []
    } catch (err) {
        // 👇️ SyntaxError: Unexpected end of JSON input

    }

    const [hLength, sethLength] = useState(0);
    

    useEffect(() => {
      let l = task[1] !== '0'
      ? history.filter(el => el[1] === task[1] || el[4] === task[4]).length
      : history.filter(el => el[4] === task[4]).length;
      sethLength(l);
    }, [task, history])


    return (
        <li key={task[0]} onClick={() => {
            setScrollY(window.scrollY)
            setShowTask(task)
        }} className={styles.wrapper}>
            <div className={styles.statusWrapper}>
					<strong>{i+1}</strong>
                {task[18] === 'Брак' ? <div><img style={{width: 20, height: 20}} src={Brak} alt=""/></div> : null}
                {task[18] === 'Новая' ? <div  className={`${styles.circle} ${styles.blue}`}></div> : null}
                {task[18] === 'В работе' ? <div  className={`${styles.circle} ${styles.orange}`}></div> : null}
                {task[18] !== 'В работе' && task[18] !== 'Новая' && task[18] !== 'Брак'  ? <div  className={`${styles.circle} ${styles.green}`}></div> : null}
            </div>
            <div style={{width: "80%"}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><p style={{fontWeight: 500}}>{task[8]} </p><p style={{fontWeight: 500}}>{task[47]}</p></div>
                <p style={{fontWeight: 400, fontSize: 14}}>{task[2]}</p>
                <p style={{fontWeight: 400, fontSize: 14}}>{task[4]}</p>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p style={{color: 'red'}}>{task[13]}</p>
                <p style={{color: 'blue'}}>Всего: {hLength}</p>
                </div>
                {task[38] ? <p>Постановщик:<span style={{fontWeight: 500}}> {task[38]}</span ></p> : <p>Постановщик:<span style={{fontWeight: 500}}> Битрикс</span ></p>}
                {<p><span style={{fontWeight: 500}}>Ответственный:</span> {deps.find(el2 => +el2.DEP === filterTaskCust(task[4]))?.CHIEF.LAST_NAME}</p>}
                {<p><span style={{fontWeight: 500}}>Исполнитель:</span> {task[7].length ? getLastName(task[7]) : task[55].length ? getLastName(task[55]) : 'Не назначен'} </p>}
                <p>{json_history?.length ? <p style={{color: 'blue', fontWeight: 500}}> {getHistoryType(json_history[json_history.length - 1])} </p>: <p style={{color: 'red', fontWeight: 500}}>Не прочитана</p>}</p>
                {/*{task[18] === 'Новая' || task[18] === 'В работе' ? <p className={styles.date}><Moment format="DD.MM.YYYY  HH:mm">{task[17]}</Moment></p> : <p className={styles.date}><Moment format="DD.MM.YYYY hh:mm">{task[6]}</Moment></p>}*/}
                <div style={{display: 'flex', justifyContent: 'space-between'}}><div>
                    <p className={styles.date}>Работа: <b>{task[34]} ч/ч</b></p>
                    <p className={styles.date}>Время: <b>{task[58] === 'to' ? 'до' : null} {task[58] === 'from' ? 'после' : null} {task[57] === '07:00' || !task[57].length ? 'Нет' : moment(`${task[56]} ${task[57]}`).format('HH:mm')}</b></p>

                </div><p>{moment(task[17]).format('DD.MM HH:mm')}</p></div>
            </div>
        </li>
    );
}



export default TaskItem;
