import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";

import styles from './TechControl.module.scss';

import Nav from "../Nav/Nav";
import DatePicker from "../DatePicker/DatePicker";
import TaskItem from "../TaskItem/TaskItem";
import TaskListWrapper from "./TaskListWrapper";
import ChangeTechWrapper from "./ChangeTech";

import { getNewReq, $newReqStatus } from "../../state";
import { $techsStatus, $techStatus, getStatus, getTechs } from "../../state/Techs";
import { $firstTime, $secondTime } from "../../state/techTime";
import { $planeStatus, $selectedUser, getPlan, setSelectedUser } from "../../state/plan";
import { $graphData, getData } from "../../state/GraphTask";
import { $selected, cleareSelected } from "../../state/longTouch";
import { $scrollY, setScrollY } from "../../state/scrollY";
import { setShowTask } from "../../state/showTask";

import Close from '../../img/close.png';

const TechControl = () => {
    const [change, setChange] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [reverse, setReverse] = useState(false);

    const test = useStore($newReqStatus);
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);
    const sel = useStore($selected);

    useEffect(() => {
        getNewReq({ 'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + firstTime.getDate() : firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth() + 1) : secondTime.getMonth() + 1}-${secondTime.getDate() <= 9 ? '0' + secondTime.getDate() : secondTime.getDate()} 00:00:01` });

        getData(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

        getStatus(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

        getPlan(firstTime);

        getTechs(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

        setScrollY(0)
    }, [refresh]);

    const [tasks, setTasks] = useState([]);

    const fetchDataHistory = async () => {
        let a = null;
        let b = null;
        const url = `getTasks.php/?startDate=${a}&endDate=${b}`;
        const base = 'https://volga24bot.com/kartoteka/api/tech';

        const mass = await fetch(`${base}/${url}`).then(res => res.json());
        setTasks(mass);
    }

    useEffect(() => {
        fetchDataHistory();
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            {
                sel.length
                    ? <img
                        src={Close}
                        alt=""
                        onClick={() => {
                            cleareSelected()
                            setScrollY(0)
                            setChange(false)
                        }}
                    />
                    : null
            }
            <DatePicker get={getNewReq} />
            <Nav setRefresh={setRefresh} />
            <TaskListWrapper sel={sel}>
                <div className={styles.reverse}>
                    <span> &nbsp;Сначала старые </span>
                    <input type='checkbox' onClick={(e) => { setReverse(!reverse) }} />
                </div>
                {
                    reverse
                        ? test.map((el, i) => <TaskItem task={el} key={i} i={i} history={tasks} />).reverse()
                        : test.map((el, i) => <TaskItem task={el} key={i} i={i} history={tasks} />)
                }
            </TaskListWrapper>
            {sel.length ? <p className={styles.changeTech} onClick={() => setChange(true)}>Передать</p> : null}

            {change ? <ChangeTechWrapper func={() => setChange(false)} /> : null}
        </div>
    )
};

export default TechControl;