import React, {useEffect, useState} from 'react';
import styles from './JobCalendar.module.scss'

import {useStore} from "effector-react";
import {$firstTime, $secondTime} from "../../state/techTIme";
import moment from 'moment'
import {$planeStatus} from "../../state/plane";

const TechAnalys = ({tech = [0, '', 0, 0], tasks, plane, planeTasks, fio}) => {
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);
    const [coef, setCoef] = useState(0);
    const [coefColor, setCoefColor] = useState('green')

    const planeTask = useStore($planeStatus);
    
    
    const [planeCoef, setPlaneCoef] = useState(0);
    const [prosrochCoef, setProsroschCoef] = useState(0);

    const getCoef = (tasks) => {
        let seconds = 0;

        tasks.forEach(el => {
            if (el[8] !== "Повтор" && el[18] !== "Брак")
            {
                if (getSurname(el[55]) === fio) {// 42 - executor   55 - plane tech
                    
                    const time = el[59] * 60 * 60;
                    seconds+=time;
                }
            }
        })
        let coef = seconds*100/28800;
        return coef.toFixed(0)
    }

    const getSurname = (fio) => {
        return fio.split(' ')[0];
    }



    useEffect(() => {
        let seconds = 0;
        if (plane) {
            planeTasks.forEach(el => {
                seconds += (el[59] * 60 * 60) ;

            })
        } else {
            tasks.forEach(el => {
                if (el[3] !== 'Повтор') {
                    const users = el[7].split(',').filter(el => el.indexOf('Фатиги') === -1 && el.indexOf('Баткаев') === -1 && el.indexOf('Петров') === -1);
                    const htos = el[9].substr(0,2) * 60 * 60;
                    const mtos = el[9].substr(3, 2) * 60;
                    const csec = +el[9].substr(6,2 )
                    const diffTime = htos + mtos + csec;

                    if (el[18] === 'В работе') {
                        let a = moment(el[5]);
                        let b = moment(new Date());
                        const diff =b.diff(a, 'seconds');
                        seconds += diff;
                        setCoefColor('orange')
                    }

                    if (el[8] === 'Монтаж' || el[8] === 'Домонтаж') {
                        if ((el[18] !== 'В работе' || el[18] !== 'Выезд не требуется' || el[18] !== 'Не выезжали') && diffTime > 300 && +el[34] > 0) {
                            if (diffTime > (el[34] * 60 * 60) / users.length) {
                                seconds += (el[34] * 60 * 60) / users.length;
                            } else {
                                seconds+=diffTime
                            }
                        }
                    } else {
                        if ((el[18] !== 'В работе' || el[18] !== 'Выезд не требуется' || el[18] !== 'Не выезжали') && diffTime > 300 && +el[34] > 0) {
                            seconds += (el[34] * 60 * 60) / users.length;
                        }
                    }
                }
            })
        }

        let coeff = (seconds * 100) / 28800;

        if (coefColor !== 'orange') {
            if (coeff < 80 ) {
                setCoefColor('red')
            } else {
                setCoefColor('green')
            }
        }


        if (coeff === 0) {
            setCoef(0)
        }
        else if (coeff < 1) {
            setCoef(coeff.toFixed(2))
        } else {
            setCoef(coeff.toFixed(0))
        }


        const Yesterday = (Date.now() - 60 * 60 * 24 * 1000); // el[17] - create time    el[18] typeResult

        setPlaneCoef(
            getCoef(
                planeTask.CURRENT.filter(el => Date.parse(el[17]) >= Yesterday)
            )
        )

        setProsroschCoef(
            getCoef(
                planeTask.CURRENT.filter(el => Date.parse(el[17]) < Yesterday)
            )
        )



    }, [tasks, firstTime, secondTime, planeTask])


    return (

            <div className={styles.mainInfo}  >
                <p>Задачи: {tasks.length + planeTask.CURRENT.filter(el => el[18] !== "Брак" && getSurname(el[55]) === fio).length}</p>
                <strong>КПД:</strong>
                <p>План: <span style={{ color: 'blue' }}>{planeCoef}%</span></p>
                <p>Факт: <span style={{ color: tasks.filter(el => el[18] === 'В работе').length ? 'orange' : coefColor }}>{coef}%</span></p>
                <p>Просроч: <span style={{ color: 'red' }}>{prosrochCoef}%</span></p>
            </div>

    );
}



export default TechAnalys;
