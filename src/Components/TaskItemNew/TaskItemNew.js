import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from "./MyTasksItem.module.scss";
import Close from '../../img/close.png'
import {getMyTask, showTaskData} from "../../state/myTask";
import Moment from "react-moment";
import {$historyStatus, getHistory} from "../../state/taskHistory";
import {useStore} from "effector-react";
import ReportWrapper from "../Search/ReportWrapper";
import {$user} from "../../state/user";
import Edit from '../../img/edit.png'
import Confirm from '../../img/check-mark.png'
import Inform from '../../img/info.png'
import History from '../../img/history.png'
import Folder from '../../img/folder.png'
import View from '../../img/view.png'
import Trash from '../../img/trashRed.png'
import Chat from '../../img/bubble-chat.png'
import BlockInfo from '../../img/data-complexity.png'
import Deffect from '../../img/back-arrow.png'
import Check from '../../img/check.png'
import {updateTask} from "../../actions/updateTask";
import ItemChat from "./ItemChat";
import {$commentsStatus, getComment} from "../../state/comments";
import Loader from "../Loader/Loader";
import HistoryItem from "./HistoryItem";
import HistoryBlock from "../History/History";
import moment from 'moment'
import Select from "react-select";
import {setShowTask} from "../../state/showTask";
import {$customerStatus, getCustomer, setCustomer} from "../../state/getCustomerByPhone";
import Back from "../../img/back.png";
import DopInfo from "./DopInfo/DopInfo";
import {filterTaskCust} from "../../utils/filterTaskCust";
import {getLastName} from "../../utils/getLastName";
import {$usersStatus} from "../../state/getUsers";
import {setHistory} from "../../actions/setHistory";
import {updateHistory} from "../../store/task";
import {$important, setImportant} from "../../store/importants";

const PopUp = ({data, func}) => {

    useEffect(() => {
        if (data.OBJ.length === 1) {

            const cust = data.CUST.filter(el => el.ObjectID === data.OBJ[0].ObjectID)[0]
            const ObjNum = +data.OBJ[0].ObjectNumber;

            func(data.OBJ[0].Name, data.OBJ[0].Address, cust.ObjCustName, ObjNum.toString(16))
            setCustomer([])
        }
    }, [])

    return (
        data.OBJ.length === 0 ? null : <div className={styles.popUp}>
            <header>
                <p>Выберите объект:</p>
                <img src={Back} alt="" onClick={() => setCustomer([])}/>
            </header>
            <ul>
                <li style={{fontWeight: 500, fontSize: 14, padding: '15``px 20px'}} onClick={() => {
                    func()
                    setCustomer([])
                }}><p className={styles.counter}>1</p> Без объекта</li>
                {data.OBJ.map((el,i) => <li key={el.ObjectID} onClick={() => {
                    const cust = data.CUST.filter(el2 => el2.ObjectID === el.ObjectID)[0]
                    const ObjNum = +el.ObjectNumber;

                    func(el.Name, el.Address, cust.ObjCustName, ObjNum.toString(16))
                    setCustomer([])
                }}><p className={styles.counter}>{i+2}</p> <div><p>{el.Name}</p> <p>{el.Address}</p></div></li>)}
            </ul>
        </div>
    )
}

const ImgDrop = ({el, id, i, func}) => {
    const user = useStore($user);
    const [show, setShow] = useState(false)
    return (
        <li>
            <div className={styles.photoDrop}> <p>Фото {i} </p> <div><img src={View} alt="" onClick={() => setShow(!show)}/> {user.ID === el[37] && <img src={Trash} alt="" onClick={func}/>}</div></div>
            {show ? <img className={styles.uploadImage} src={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${id}/${el}`} alt=""/> : null}
        </li>
    )
}

const options = [
    { value: 'Заявка', label: 'Заявка' },
    { value: 'Претензия', label: 'Претензия' },
    { value: 'СО', label: 'Снятие Объемов' },
    { value: 'Задача', label: 'Задача' },
    { value: 'Демонтаж', label: 'Демонтаж' },
    { value: 'Монтаж', label: 'Монтаж' },
    { value: 'Нет контрольного события', label: 'Нет контрольного события' }
]


const TaskItemNew = ({item}) => {
    const deps = useStore($usersStatus);

    const [loading, setLoading] = useState(false)
    const [report, showReport] = useState(false);
    const important = useStore($important);

    const user = useStore($user);
    const [history2, setHistory2] = useState([]);
    const [form, setForm] = useState({
        name: item[2],
        address: item[4],
        desc: item[13],
        client: item[40],
        type: item[8],
        date: item[17],
        time: item[34],
        brak: item[43]
    })

    const comments = useStore($commentsStatus);
    const customer = useStore($customerStatus);

    const [edit, setEdit] = useState(false);
    const [nav, setNav] = useState('info');
    useEffect(() => {
        getComment(item[0]);
        const phone = item[40].split('-')[0];
        if (edit && (!form.name.length || !form.address.length) && phone.length) {
            getCustomer(phone)
        }
        if (item[52] && JSON.parse(item[52])) {
            setHistory2(JSON.parse(item[52]).flat(1))
        }
    }, [edit, nav])


    useEffect(() => {
        if (item[50] === '0000-00-00 00:00:00') {
            setHistory(item[0], 'view', '', `${user.LAST_NAME} ${user.NAME} ${user.SECOND_NAME}`, (a) => updateHistory(a));
            fetch(`https://volga24bot.com/kartoteka/api/tech/setView.php?id=${item[0]}`).then(res => res.json()).then(res => {
                setImportant([...important, item])
            })
        }
    }, [])

    const timeCounter = () => {
        const deadline = item[34] * 60;

        const timeJob = ((item[9].substr(0,2) * 60) + +item[9].substr(3,2))


        function getTimeFromMins(mins) {
            let hours = Math.trunc(mins/60);
            let minutes = mins % 60;
            return `${hours < 9 ? '0'+hours : hours}:${minutes < 9 ? '0'+minutes : minutes}:00`;
        };

        if (deadline < timeJob) {
            return <div className={styles.taskItemInput}>
                <p className={styles.label}>Просрочена на: <span style={{fontWeight: 500, color: 'red', fontSize: 14}}>{getTimeFromMins(timeJob-deadline)}</span></p>


            </div>
        }
    }

    const confirmTask = () => {
        let answer = window.confirm('Принять задачу?');

        if (answer) {
            fetch(`https://volga24bot.com/kartoteka/api/tech/setConfirm.php?id=${item[0]}`)
                .then(res => res.json())
                .then(res => {
                    if (res === 1) {
                        alert('Задача подтверждена')
                        setShowTask(false);
                        getMyTask(user.ID)
                    }
                })
        }

    }


    const sendFiles = (files) => {
        setLoading(true)
        let formData = new FormData();

        for (let i = 0; i<files.length; i++) {

            formData.append([files[i].name], files[i])
        }

        formData.append("id", item[0])
        fetch('https://volga24bot.com/kartoteka/api/tech/Files.php',{

            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    setShowTask(res)
                    setLoading(false)
                }  else {
                    alert('Произошла ошибка')
                }

            })
    }
    const deleteFile = (fileName) => {

        const files = item[44].split(';');

        const index = files.indexOf(fileName)
        files.splice(index, 1)

        let formData = new FormData();


        formData.append("id", item[0])
        formData.append("item", fileName)
        formData.append("files", files.join(';'))
        fetch('https://volga24bot.com/kartoteka/api/tech/deleteFile.php',{

            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(res => res ? setShowTask(res) : alert('Произошла ошибка'))

    }

    //console.log(history2)

    return (
        <div className={styles.taskItemWrapper}>
            {loading ? <div className={styles.loaderWrapper}><Loader/></div> : null}
            <header><p>{item[8] === 'СО' ? 'Снятие Объемов' : item[8]} {item[47]}</p> <img src={Close} alt="" onClick={() => setShowTask(false)}/> </header>
            <nav className={styles.Nav}>
                <ul>
                    <li className={nav === 'info' ? styles.active : null} onClick={() => setNav('info')}>
                        <img src={Inform} alt=""/>
                    </li>
                    <li className={nav === 'blockInfo' ? styles.active : null} onClick={() => setNav('blockInfo')}>
                        <img src={BlockInfo} alt=""/>
                    </li>
                    <li className={nav === 'files' ? styles.active : null} onClick={() => setNav('files')}>
                        <img src={Folder} alt=""/>

                    </li>
                    <li className={nav === 'history' ? styles.active : null} onClick={() => setNav('history')}>
                        <img src={History} alt=""/>

                    </li>
                    <li style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={nav === 'historyObj' ? styles.active : null} onClick={() => setNav('historyObj')}>
                        <p>История</p>
                    </li>
                    {<li className={nav === 'chat' ? styles.active : null} onClick={() => setNav('chat')} style={{position: 'relative'}}>
                        <img src={Chat} alt=""/>
                        {comments.filter(el => el[6] === "0" && el[1] !== user.ID).length ? <p className={styles.countUnwrite}>{comments.filter(el => el[6] === "0" && el[1] !== user.ID).length}</p> : null}
                    </li>}
                </ul>
            </nav>
            {nav === 'historyObj' ? <HistoryBlock block={item[1]} address={item[4]} setInfo={() => setNav('info')}/> : null}

            {nav === 'info' ? <div className={styles.taskItemBody}>

                {edit ? <img src={Confirm} alt="" className={styles.edit} style={{borderColor: "#3F9257"}} onClick={() => {
                    updateTask(form, item[0])
                    item[2] = form.name
                    item[4] = form.address
                    item[13] = form.desc
                    item[40] = form.client
                    item[17] = form.date
                    item[43] = form.brak
                    item[8] = form.type
                    item[34] = form.time
                    setEdit(false)
                }}/> : (user.ID === item[37] || user.ID === '109' || user.ID === '257' || user.ID === '1' || user.ID === '317') ? <img src={Edit} alt="" className={styles.edit} onClick={() => setEdit(true)}/> : null }
                <div className={styles.dflex}>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}  >Статус</p>
                        <p style={item[18] === 'Брак' ? {color: "red"} : null} className={`${styles.status} ${item[18] === 'Новая' ? styles.redStatus : null} ${item[18] === 'В работе' ? styles.orangeStatus : null} ${item[18] !== 'Новая' && item[18] !== 'В работе' ? styles.blueStatus : null}`} >{item[18]}</p>
                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}  >Номер</p>
                        <p style={{fontWeight: 500}}>{item[47]}</p>
                    </div>
                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Вид задачи</p>
                    {edit ?  <Select options={options}  onChange={(e) => setForm(prevState => ({...prevState, type: e.value}))} defaultValue={form.type}/>:<p className={`${styles.status} `} >{item[8]}</p> }
                </div>
                {item[18] === 'Брак' ? <div className={styles.taskItemInput}>
                    <p className={styles.label}>Причина брака</p>
                    {edit ? <input type="text" value={form.brak} onChange={e => setForm(prevState => ({...prevState, brak: e.target.value}))}/>:<p className={`${styles.status} `} >{item[43]}</p> }
                </div> : null}
                    <div className={styles.taskItemInput}>
                    <p className={styles.label}>Ответственный</p>
                    {<p>{deps.find(el => +el.DEP === filterTaskCust(item[4]))?.CHIEF.LAST_NAME}</p>}
                    </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Исполнитель</p>
                    {<p>{item[7].length ? getLastName(item[7]) : item[55].length ? getLastName(item[55]) : 'Не назначен'} </p>}
                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Название объекта</p>
                    {edit ? <input type="text" value={form.name} onChange={e => setForm(prevState => ({...prevState, name: e.target.value}))}/>:<p>{item[2]}</p> }

                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Адрес объекта</p>
                    {edit ? <input type="text" value={form.address} onChange={e => setForm(prevState => ({...prevState, address: e.target.value}))}/>: <p>{item[4]}</p>}
                </div>
                {/*<div className={styles.taskItemInput}>*/}
                {/*    <p className={styles.label}>Срок исполнения</p>*/}
                {/*    {edit ? <input type="datetime-local" value={form.date} onChange={e => setForm(prevState => ({...prevState, date: e.target.value}))}/>: <p><Moment format="DD.MM.YY HH:mm">{item[17]}</Moment></p>}*/}
                {/*</div>*/}
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Описание</p>
                    {edit ? <textarea style={{width: '100%', height: 100}} value={form.desc} onChange={e => setForm(prevState => ({...prevState, desc: e.target.value}))}/>:<p>{item[13]}</p> }
                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Клиент</p>
                    {edit ? <input type="text" value={form.client} onChange={e => setForm(prevState => ({...prevState, client: e.target.value}))}/>:<p>{item[40]}</p> }
                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Создатель задачи</p>
                    <p>{item[38]}</p>
                </div>
                <div className={styles.taskItemInput}>
                    <p className={styles.label}>Время на работу</p>
                    {edit ? <input type="text" value={form.time} onChange={e => setForm(prevState => ({...prevState, time: e.target.value}))}/>:<p>{item[34].indexOf('0.666') !== -1 ? '40 минут' : `${item[34]} ч.ч`}</p> }
                </div>
                {timeCounter()}
                {item[58] ? <div className={styles.taskItemInput}>
                    <p className={styles.label}>Планирование</p>
                    <p> {item[58] === 'to' ? 'до' : null} {item[58] === 'from' ? 'после' : null} {item[57] !== '07:00' ? `${moment(item[56]).format('DD.MM')} ${item[57]}` : `${moment(item[56]).format('DD.MM')}`}</p>
                </div> : null}
            </div> : null}
            {nav === 'history' ? <div className={styles.processTracker}>

                <HistoryItem title={'Поставлена'} active={[0, new Date(item[17]).getTime() <= new Date(item[51]).getTime() ? item[17] !== '0000-00-00 00:00:00' ? item[17] : item[51] : item[51] !== '0000-00-00 00:00:00' ? item[51] : item[17]]} />
                <div className={styles.deffect_block}>
                    {history2.filter(el => el.type === 'view').length === 0 && <HistoryItem title={'Прочитана'} withLine={true} active={[]}/>}
                    {history2.map(el => {
                        let type = '';

                        if (el.type === 'call') {
                        type = 'Созвонился'
                        } else if (el.type === 'start') {
                            type = 'В работе'
                        } else if (el.type === 'comment') {
                            type = `Примечание от ${el.user.split(' ')[0]}`
                        }  else if (el.type === 'finish') {
                            type = 'Завершил работу'
                        } else if (el.type === 'changeTech') {
                            type = `Смена исполнителя`
                        } else if (el.type === 'view') {
                            type = `Прочитана`
                        }

                        if (el.type === 'view') {
                        return <>
                        <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>
                        {history2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}
                        </>
                    } else if (el.type !== 'deffect') {
                        return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>

                    }

                    })}
                            {history2.filter(el => el.type === 'deffect').length === 1 && <HistoryItem title={'Брак'} withLine={true} active={[0, history2.filter(el => el.type === 'deffect')[0].date]} activeText={history2.filter(el => el.type === 'deffect')[0].value} failed={true}/>}
                            {history2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]}/>}
                            {history2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]}/>}
                </div>

                {/*{history2.map(el2 => {*/}
                {/*    return*/}

                {/*        {el2.map(el => {*/}
                {/*            let type = '';*/}

                {/*            if (el.type === 'call') {*/}
                {/*                type = 'Созвонился'*/}
                {/*            } else if (el.type === 'start') {*/}
                {/*                type = 'В работе'*/}
                {/*            } else if (el.type === 'comment') {*/}
                {/*                type = `Примечание от ${el.user.split(' ')[0]}`*/}
                {/*            }  else if (el.type === 'finish') {*/}
                {/*                type = 'Завершил работу'*/}
                {/*            } else if (el.type === 'changeTech') {*/}
                {/*                type = `Смена исполнителя`*/}
                {/*            } else if (el.type === 'view') {*/}
                {/*                type = `Прочитана`*/}
                {/*            }*/}

                {/*            if (el.type === 'view') {*/}
                {/*                return <>*/}
                {/*                    <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}
                {/*                    {el2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
                {/*                </>*/}
                {/*            } else if (el.type !== 'deffect') {*/}
                {/*                return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}

                {/*            }*/}

                {/*        })}*/}

                {/*        {el2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]}/>}*/}
                {/*        {el2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]}/>}*/}
                {/*        {el2.filter(el => el.type === 'deffect').length === 1 && <HistoryItem title={'Брак'} withLine={true} active={[0, el2.filter(el => el.type === 'deffect')[0].date]} activeText={el2.filter(el => el.type === 'deffect')[0].value} failed={true}/>}*/}

                {/*})}*/}








                {/*</>*/}

                    {/*{history2.filter(el => el.type === 'view').length === 0 && <HistoryItem title={'Прочитана'} withLine={true} active={[]}/>}*/}
                    {/*{history2.length === 0 &&  <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
                    {/*{history2.map(el => {*/}
                    {/*    let type = '';*/}

                    {/*    if (el.type === 'call') {*/}
                    {/*        type = 'Созвонился'*/}
                    {/*    } else if (el.type === 'start') {*/}
                    {/*        type = 'В работе'*/}
                    {/*    } else if (el.type === 'comment') {*/}
                    {/*        type = `Примечание от ${el.user.split(' ')[0]}`*/}
                    {/*    }  else if (el.type === 'finish') {*/}
                    {/*        type = 'Завершил работу'*/}
                    {/*    } else if (el.type === 'changeTech') {*/}
                    {/*        type = `Смена исполнителя`*/}
                    {/*    } else if (el.type === 'view') {*/}
                    {/*        type = `Прочитана`*/}
                    {/*    }*/}
                    {/*    if (type === 'Прочитана') {*/}
                    {/*        return <>*/}
                    {/*            <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}
                    {/*            {history2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
                    {/*        </>*/}
                    {/*    } else {*/}
                    {/*        return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}

                    {/*    }*/}
                    {/*})}*/}

                    {/*{history2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]}/>}*/}
                    {/*{history2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]}/>}*/}


                <div>
                    {item[18] !== 'Новая' &&  item[18] !== 'В работе' && (item[6] || item[15] || item[12]) ? <button className={styles.raport} onClick={() => showReport(item)}>Посмотреть отчет</button> : null}
                </div>
            </div> : null}
            {nav === 'blockInfo' ? item[1] !== '0' ? <DopInfo num={item[1]}/> : <p style={{textAlign: "center"}}>В задаче нет номера объекта!</p> : null}

            {nav === 'files' ? <div className={styles.filesWrapper}>
                <ul>
                    {item[44].split(';').reverse().map((el, i) => {
                        if (el.length > 1 ) {
                            const extend = el.split('.')[1];
                            if (extend === 'jpeg' || extend === 'png' || extend === 'gif' || extend === 'bmp' || extend === 'jpg' || extend === 'tiff' || extend === 'jfif') {
                                return <ImgDrop key={el} i={i+1} el={el} id={item[0]} func={() => deleteFile(el)}/>
                            } else {
                                return <li key={el}><p className={styles.photoDrop}><a target={'_blank'} href={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`} download={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`}>{el.replace(/_/gi, ' ').substr(0, 30)}...</a> <div>{user.ID === el[37] && <img onClick={() => deleteFile(el)} src={Trash} alt=""/>}</div></p></li>
                            }
                        }

                    })}
                </ul>  { user.ID === item[37] || user.ID === '109' || user.ID === '317' || user.ID === '1' ? <label  className={styles.filesLabel}>
                <input type="file" multiple onChange={(e) => sendFiles(e.target.files)}/>
                {'Загрузить файлы'}
            </label> : null}
            </div> : null}
            {nav === 'chat' ? <ItemChat item={item}/> : null}
            {report ? <ReportWrapper req={item} func={() => showReport(false)}/> : null}

            {nav !== 'chat' && (user.ID === item[37] || user.ID === '109' || user.ID === '317' || user.ID === '277' || user.ID === '1' || user.ID === '211') ? <footer className={styles.footerNav}>
                <ul>
                    {user.ID === item[37] || user.ID === '109' || user.ID === '211' ? <li className={nav === 'info' ? styles.active : null}  style={{background: 'white'}} onClick={() => {
                        const answer = window.confirm('Удалить задачу?')

                        if (answer) {
                            fetch(`https://volga24bot.com/kartoteka/api/tech/deleteTask.php?id=${item[0]}`)
                                .then(res => res.json())
                                .then(res => {
                                    if (res === 'success') {
                                        setShowTask(false);
                                        getMyTask(user.ID)
                                    } else {
                                        alert('Произошла ошибка!')
                                    }
                                })
                        }
                    }}>
                        <img src={Trash} alt=""/>
                    </li> : <li></li>}
                    {item[18] !== 'Брак' ? <li onClick={() => {
                        const answer = window.prompt('Для смены статуса на "Брак" оставьте комментарий!')
                        setLoading(true)
                        fetch(`https://volga24bot.com/kartoteka/api/tech/deffectTask.php?id=${item[0]}&comment=${answer}`)
                            .then(res => res.json())
                            .then(res => {
                                setLoading(false)
                                if (res) {
                                    setHistory2(res)
                                } else {
                                    alert('Произошла ошибка!')
                                }
                            })

                    }}>
                        <img src={Deffect} alt=""/>
                    </li> : null}
                   <li className={nav === 'history' ? styles.active : null} onClick={() => confirmTask()}>
                        <img src={Check} alt=""/>
                    </li>

                </ul>
            </footer> : null}
            {customer.OBJ && customer !== 'loading' ? <PopUp data={customer} func={(a='',b='',c='',d='') => setForm(prevState => ({...prevState, name: a, address: b, clientFio: c, objNum: d})  )}/> : null}
            {customer === 'loading' ? <Loader/> : null}

        </div>
    );
}



export default TaskItemNew;
