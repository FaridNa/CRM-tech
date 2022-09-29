import React, {useEffect, useState} from 'react';
import styles from './NavTasks.module.scss'
import {useStore} from "effector-react";
import {$planeStatus, $selectedUser} from "../../../state/plane";
import {$depStatus} from "../../../state/user";
import {$graphData} from "../../../state/GraphTask";
import moment from 'moment'
import {$allReqStatus} from "../../../state";
import {$firstTime} from "../../../state/graphTime";
import TaskItem from "../../TaskItem/TaskItem";


const filterTasks = (el, dep, selected) => {
    let online = dep?.find(el2 => el[55].indexOf(el2.LAST_NAME) !== -1 || el[7].indexOf(el2.LAST_NAME) !== -1);

    if (online) {
        if (selected) {
            if (el[55].indexOf(selected) !== -1 || el[7].indexOf(selected) !== -1) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    } else {
        return false
    }

}

const NavTasks = () => {
    const [nav ,setNav] = useState('all')
    const plane = useStore($planeStatus);
    const dep = useStore($depStatus);
    const selected = useStore($selectedUser);
    const graph = useStore($graphData);
    const allReq = useStore($allReqStatus);
    const firstTime = useStore($firstTime);
    //console.log(dep)

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
    }, [])


    return (
        <div style={{marginTop: 30}}>
            <div className={styles.mainNavWrapper}>
                <ul>
                    <li style={{background: 'rgba(0,57,234, .5)'}} onClick={() => nav === 'plane' ? setNav('all') : setNav('plane')} className={nav === 'plane' ? styles.active : null}><p>
                        {plane.CURRENT.filter(el => filterTasks(el, dep, selected))?.length}
                    </p> <p>План</p> </li>

                    <li style={{background: 'orange'}} onClick={() => nav === 'injob' ? setNav('all') : setNav('injob')} className={nav === 'injob' ? styles.active : null}><p>
                        {graph.filter(el => el[18] === 'В работе').filter(el => filterTasks(el, dep, selected))?.length}
                    </p> <p>В работе</p> </li>
                    <li style={{background:  'rgba(35,163,62,0.9)'}} onClick={() => nav === 'comp' ? setNav('all') : setNav('comp')} className={nav === 'comp' ? styles.active : null}><p>
                        {graph.filter(el => el[18] !== 'В работе').filter(el => filterTasks(el, dep, selected))?.length}
                    </p> <p>Сделано</p> </li>
                </ul>
                <ul>
                    <li style={{background: 'rgba(0,57,234, .5)'}} onClick={() => nav === 'change' ? setNav('all') : setNav('change')} className={nav === 'change' ? styles.active : null}><p>
                        {plane.CHANGES.filter(el => filterTasks(el, dep, selected))?.length}
                    </p> <p>Перенос</p> </li>
                    <li style={{background: 'rgba(255,0,0,0.4)'}} onClick={() => nav === 'deff' ? setNav('all') : setNav('deff')} className={nav === 'deff' ? styles.active : null}><p>
                        {plane.CURRENT.filter(el => moment(`${el[56]} ${el[57]}`).valueOf() < new Date().getTime()).filter(el => filterTasks(el, dep, selected))?.length}
                    </p> <p>Просроч</p> </li>
                    <li style={{background: 'rgba(243,58,58,0.8)'}} onClick={() => nav === 'nc' ? setNav('all') : setNav('nc')} className={nav === 'nc' ? styles.active : null}><p>
                        {allReq.filter(el => (el[17].indexOf(moment(firstTime).format('YYYY-MM-DD')) !== -1 || el[17].indexOf(moment(firstTime).subtract(1, 'day').format('YYYY-MM-DD')) !== -1) && el[18] === 'Новая')?.length}
                    </p> <p>Не сделано</p> </li>
                </ul>
            </div>
            <ul className={styles.tasks_list}>

                {nav === 'all' && [
                    ...graph.filter(el => filterTasks(el, dep, selected)),
                    ...plane.CURRENT.filter(el => filterTasks(el, dep, selected))
                ].map((el, i) => <TaskItem task={el} key={el[0]} i={i} history={tasks}/>)}
                {nav === 'plane' && plane.CURRENT.filter(el => filterTasks(el, dep, selected))?.map((el, i)=> <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
                {nav === 'injob' && graph.filter(el => el[18] === 'В работе').filter(el => filterTasks(el, dep, selected))?.map((el, i) => <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
                {nav === 'comp' && graph.filter(el => el[18] !== 'В работе').filter(el => filterTasks(el, dep, selected))?.map((el, i)=> <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
                {nav === 'change' && plane.CHANGES.filter(el => filterTasks(el, dep, selected))?.map((el, i) => <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
                {nav === 'deff' && plane.CURRENT.filter(el => moment(`${el[56]} ${el[57]}`).valueOf() < new Date().getTime()).filter(el => filterTasks(el, dep, selected))?.map((el, i) => <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
                {nav === 'nc' && allReq.filter(el => (el[17].indexOf(moment(firstTime).format('YYYY-MM-DD')) !== -1 || el[17].indexOf(moment(firstTime).subtract(1, 'day').format('YYYY-MM-DD')) !== -1) && el[18] === 'Новая')?.map((el, i) => <TaskItem task={el} key={el[0]} i={i} history={tasks}/>) }
            </ul>
        </div>
    );
};

export default NavTasks;