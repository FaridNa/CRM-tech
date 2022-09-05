import React, {useEffect, useRef, useState} from "react";
import moment from "moment-timezone";
import styles from "../JobCalendar.module.scss";
import {setShowTask} from "../../../state/showTask";
import {useStore} from "effector-react";
import {$firstTime} from "../../../state/graphTime";


export const TimeLineItem = ({timeStart, timeFinish, type, diffTime, task, i, typeLine, lastI, lastitem, tasksLength}) => {

    const [width, setWidth] = useState(null);
    const [left, setLeft] = useState(null);
    const [width2, setWidth2] = useState(null);
    const [width3, setWidth3] = useState(null);
    const [left2, setLeft2] = useState(null);
    const [left3, setLeft3] = useState(null);
    const [color, setColorr] = useState('green');
    const [newTimeStart, setNewTimeStart] = useState(null);
    const users = task[7].split(',').filter(el => el.indexOf('Фатиги') === -1 && el.indexOf('Петров') === -1)
    const firstTime = useStore($firstTime);

    const deadline = task[34] * 60 / users.length;
    let timeJob;

    useEffect(() => {
        if (type === 'В работе') {
            let newDate = moment().tz('Europe/Astrakhan')
            let startDate = moment({
                h: timeStart.substr(0,2),
                m: timeStart.substr(3,2),
                s: 0
            })
            const seconds = newDate.diff(startDate, "seconds")

            if (seconds < 0) {
                timeJob = 0;
            } else {
                let resultDate = moment("1900-01-01 00:00:00").add(seconds, 'seconds').format("HH:mm:ss");
                diffTime=resultDate.substr(0,5)
                setColorr('orange');
                timeJob = diffTime.substr(0,2) * 60 + +diffTime.substr(3,2);
            }

        } else {
            timeJob = task[9].substr(0,2) * 60 + +task[9].substr(3,2)
        }



            if (typeLine === 'plane') {

                timeJob = task[59] * 60;
            }

        if (timeJob > deadline && deadline >= 0) {
            let width = deadline * 0.5
            let left = (((timeStart.substr(0, 2) - 8) * 60) + +timeStart.substr(3, 2)) * 0.5;


            if (left < 0) {
                left = 0;
            }


            let left2 = left + width;
            let width2 = (timeJob * 0.5) - width
            setWidth(width)
            setWidth2(width2)
            setLeft2(left2)
            setLeft(left)
        } else {

            let width = timeJob * 0.5
            let left = (((timeStart.substr(0, 2) - 8) * 60) + +timeStart.substr(3, 2)) * 0.5;
            if (left < 0) {
                left = 0;
            }

            if (typeLine === 'plane') {
                left = 0;
                if (task[57] === '07:00' || task[56] !== moment(firstTime).format('YYYY-MM-DD')) {
                    let previous = lastitem.slice(0, i);

                    if (previous.length) {
                        previous.forEach(el => {
                            left += (+el[59]*60) * 0.5 + 4
                        })
                    } else {
                        left = 0;
                    }
                } else {
                    left = (((timeStart.substr(0, 2) - 8) * 60) + +timeStart.substr(3, 2)) * 0.5;
                }

                if (task[58] === 'to') {
                    left -= task[59] * 60 * 0.5+15
                    const newTimeStart = (task[57].substr(0,2) * 60 + (+task[57].substr(3,2))) - task[59] * 60
                    setNewTimeStart(moment.duration(newTimeStart-30, 'minutes').format('HH:mm'));
                }
            }

            setWidth(width)
            setLeft(left)
        }

        if (type === 'В работе') {

            let width = timeJob * 0.5;
            let left = (((timeStart.substr(0, 2) - 8) * 60) + +timeStart.substr(3, 2)) * 0.5;

            let plane_deadline = task[34] / task[7].split(',').length

            if (plane_deadline > 9) {
                plane_deadline = 9 * 30;
            }  else {
                plane_deadline = plane_deadline * 30;
            }
            setWidth3(plane_deadline - width);
            setLeft3( left + width);
        }

    }, [lastitem, task])

    return (
        <div>
            <div className={`${styles.item}` }  style={{width: width, left: left, backgroundColor: typeLine === 'plane' ? task[56] !== moment(firstTime).format('YYYY-MM-DD') || moment(`${task[56]} ${task[57]}`).valueOf() < new Date().getTime() ? 'rgba(255,0,0,0.4)' : 'rgba(0,57,234, .5)' : color}} onClick={() => setShowTask(task)}>
                <p className={styles.number}>{i !== -1 ? tasksLength ? tasksLength+i+1 : i+1 : ' '}</p>
                {i === 0 ? <span className={styles.bottomLabel}>{newTimeStart ? newTimeStart : timeStart}</span> : null}
                {i === lastI && width2 === null && left2 === null  ? <span className={styles.finishBottomLabel}>{timeFinish}</span> : null}
            </div>
            {width2 !== null && left2 !== null ?
                <div onClick={() => setShowTask(task)} className={`${styles.item} `}  style={{width: width2, left: left2, backgroundColor: "red",}} >
                    {width ? null : <p className={styles.number}>{i+1}</p>}
                    {i === lastI && width2 !== null && left2 !== null  ? <span className={styles.finishBottomLabel}>{timeFinish}</span> : null}
                </div> : null}
            {width3 !== null && left3 !== null ? <div onClick={() => setShowTask(task)} className={`${styles.item} `}  style={{width: width3, left: left3, backgroundColor: 'rgba(0,57,234, .5)',}} >
                {width ? null : <p className={styles.number}>{i+1}</p>}
                {i === lastI && width3 !== null && left3 !== null  ? <span className={styles.finishBottomLabel}>{timeFinish}</span> : null}
            </div> : null}
        </div>
    )
}