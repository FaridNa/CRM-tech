import React, {useEffect, useState} from 'react';
import styles from './CreateTask.module.scss'
import Select from 'react-select'
import {useStore} from "effector-react";
import {createTask} from "../../actions/CreateTask";
import {$firstTime, $secondTime} from "../../state/techTIme";
import {$depStatus, $user} from "../../state/user";
import SearchItems from "./SearchItems";
import Back from '../../img/back.png'
import Create from '../../img/check.png'
import {$loading} from "../../state/loading";
import Loader from "../Loader/Loader";
import Info from '../../img/info.png'
import {$allReqStatus} from "../../state";
import {$planeStatus, $selectedUser} from "../../state/plane";
import {$graphData} from "../../state/GraphTask";
import {$customerStatus, getCustomer, setCustomer} from "../../state/getCustomerByPhone";



const utils = ['ОС', 'ПС', 'ВН', 'КТС', 'ТО', 'Иное (написать в комментарий)']


const PopUpWithTimer = () => {
    const [visible, setvisible] = useState(true)
    useEffect(() => {
        let timer = setTimeout(() => setvisible(false), 3000);

        return () => clearTimeout(timer);
    })

    return visible && <div className={styles.popUpWt}>
        <p>Клиент не найден</p>
    </div>
}

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
        data.OBJ.length === 0 ? <PopUpWithTimer/> : <div className={styles.popUp}>
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


const CreateTask = ({func}) => {
    const user = useStore($user);
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);
    const loading = useStore($loading);
    const customer = useStore($customerStatus);
    const dep = useStore($depStatus);

    const allReq = useStore($allReqStatus);
    const plane = useStore($planeStatus);
    const graph = useStore($graphData);

    const [form, setForm] = useState({
        type: 'Заявка',
        objNum: '',
        name: '',
        address: '',
        customer: '',
        comment: '',
        vo: [],
        voText: '',
        clientPhone: '',
        clientFio: '',
        date: '',
        changeTech: false,
        files: '',
        label: ''
    });
    const options = [
        { value: 'Заявка', label: 'Заявка'},
        { value: 'Претензия', label: 'Претензия'},
        { value: 'СО', label: 'Снятие Объемов' },
		  { value: 'ТО', label: 'Техническое Обслуживание' },
        { value: 'Демонтаж', label: 'Демонтаж' },
        { value: 'Монтаж', label: 'Монтаж' },
        { value: 'Нет контрольного события', label: 'Нет контрольного события' }
    ]
    const [focusNum, setFocusNum] = useState(false);
    const [focusName, setFocusName] = useState(false);
    const [focusAddress, setFocusAddress] = useState(false);
    const [focusUtils, setFocusUtils] = useState(false);
    const options2 = dep.filter(el => el.WORK_POSITION !== 'Водитель' & !(el.WORK_POSITION.includes('Начальник'))).map(el => ({value: `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`, label: `${el.LAST_NAME} ${el.NAME[0]}.${el.SECOND_NAME[0]}`}))

    return (
        <>
            <div className={styles.createTaskWrapper} >
                <header>
                    <img src={Back} alt="" onClick={func}/>
                    <img src={Create} alt="" onClick={() => {
                        createTask(form, func, firstTime, secondTime, user, plane.CURRENT, graph)
                    }} />
                </header>
                <div className={styles.infoCreate}>
                    <img src={Info} alt=""/>
                    <p>Введя номер телефона клиента, будет произведен поиск всех его объектов, далее можно выбрать один из них, для автозаполения</p>
                </div>
                <div className={styles.createTaskForm}>

                    <label>
                        Вид заявки
                        <select className={styles.select} onFocus={() => {
                            setFocusNum(false)
                            setFocusAddress(false)
                            setFocusName(false)
                            setFocusUtils(false)
                        }} onChange={(e) => {
									let newComment = "";
									if (e.target.value === "ТО") newComment = "Ежеквартальное ТО";
                            setForm(prevState => ({...prevState, type: e.target.value, comment: newComment}))
                        }}>
                            {options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                        </select>

                    </label>
                    {form.type === 'Заявка' || form.type === 'ТО' || form.type === 'Демонтаж' || form.type === 'Претензия' || form.type === 'Нет контрольного события' ?
                        <>
                            <div style={{position: 'relative'}} >
                                <label>
                                    № объекта
                                    <input type="text"  onFocus={() => {
                                        setFocusNum(true)
                                        setFocusAddress(false)
                                        setFocusName(false)
                                        setFocusUtils(false)
                                    }} className={styles.inputText} value={form.objNum} onChange={(e) => setForm(prevState => ({...prevState, objNum: e.target.value}))}/>
                                </label>
                                {focusNum ? <SearchItems value={form.objNum} type={"num"} func={(a,b,c) => setForm(prevState => ({...prevState, objNum: a, name: b, address: c}))} focus={() => setFocusNum(false)}/> : null}
                            </div>
                            < div style={{position: 'relative'}}>
                                <label>
                                    Адрес объекта
                                    <input type="text" onFocus={() => {
                                        setFocusNum(false)
                                        setFocusAddress(true)
                                        setFocusUtils(false)
                                        setFocusName(false)
                                    }} className={styles.inputText} value={form.address} onChange={(e) => setForm(prevState => ({...prevState, address: e.target.value}))}/>
                                </label>
                                {focusAddress ? <SearchItems value={form.address} type={"address"} func={(a,b,c) => setForm(prevState => ({...prevState, objNum: a, name: b, address: c}))} focus={() => setFocusAddress(false)}/> : null}
                            </div>
                            <div style={{position: 'relative'}}>
                                <label>
                                    Название объекта
                                    <input type="text" onFocus={() => {
                                        setFocusNum(false)
                                        setFocusAddress(false)
                                        setFocusName(true)
                                        setFocusUtils(false)
                                    }} className={styles.inputText} value={form.name} onChange={(e) => setForm(prevState => ({...prevState, name: e.target.value}))}/>
                                </label>
                                {focusName ? <SearchItems value={form.name} type={"name"} func={(a,b,c) => setForm(prevState => ({...prevState, objNum: a, name: b, address: c}))} focus={() => setFocusName(false)}/> : null}
                            </div>
                            {form.type !== 'Нет контрольного события' ? <label>
                                Тел. клиента
                                <input type="text"   onFocus={() => {
                                    setFocusNum(false)
                                    setFocusAddress(false)
                                    setFocusName(false)
                                    setFocusUtils(false)
                                }} className={styles.inputText} value={form.clientPhone}

                                onChange={(e) => {
                                    let phoneNumber = e.target.value
                                    if (phoneNumber.length !== 12) {
                                        let formatPhone = phoneNumber.replace('+7', '8').replace(/[^\d]/g, '')

                                        let eleven = formatPhone.substr(0, 11);


                                        if (formatPhone.length-1 < 11) {
                                            setForm(prevState => ({...prevState, clientPhone: formatPhone}))
                                            if (eleven.length === 11) {

                                                getCustomer(eleven)
                                            }
                                        }
                                    }



                                }} placeholder="Формат: +7 либо 8" />
                            </label> : null}
                            {form.type !== 'Нет контрольного события' ? <label>
                                ФИО. клиента
                                <input type="text" onFocus={() => {
                                    setFocusNum(false)
                                    setFocusAddress(false)
                                    setFocusName(false)
                                    setFocusUtils(false)
                                }} className={styles.inputText} value={form.clientFio} onChange={(e) => {
                                    setForm(prevState => ({...prevState, clientFio: e.target.value}))
                                }}/>
                            </label> : null}

                        </>
                        : <div>
                            {form.type !== 'Задача' ? <label>
                                Адрес объекта
                                <input type="text" className={styles.inputText} value={form.address} onChange={(e) => setForm(prevState => ({...prevState, address: e.target.value}))}/>
                            </label> : null}
                            {form.type !== 'Задача' ? <label>
                                Название объекта
                                <input type="text"  className={styles.inputText} value={form.name} onChange={(e) => setForm(prevState => ({...prevState, name: e.target.value}))}/>
                            </label> : null}
                            <label>
                                Тел. клиента
                                <input type="tel"  className={styles.inputText} value={form.clientPhone} onChange={(e) => {
                                    let phoneNumber = e.target.value
                                    if (phoneNumber.length !== 12) {
                                        let formatPhone = phoneNumber.replace('+7', '8').replace(/[^\d]/g, '')

                                        let eleven = formatPhone.substr(0, 11);


                                        if (formatPhone.length-1 < 11) {
                                            setForm(prevState => ({...prevState, clientPhone: formatPhone}))
                                            if (eleven.length === 11) {

                                                getCustomer(eleven)
                                            }
                                        }
                                    }



                                }} placeholder="Формат: +7 либо 8" />
                            </label>
                            <label>
                                ФИО. клиента
                                <input type="text" className={styles.inputText} value={form.clientFio} onChange={(e) => {
                                    setForm(prevState => ({...prevState, clientFio: e.target.value}))

                                }}/>
                            </label>
                        </div>}

                    {/*//////////////*/}
                    <label>
                        Исполнитель
                        <Select options={options2} onChange={(e) => setForm(prevState => ({...prevState, customer: e.value}))} placeholder={'Общая'}/>
                    </label>
                    <label>
                        {form.type !== 'Нет контрольного события' ? 'Комментарий' : 'Дата появления проблемы'}
                        <textarea type="text" onFocus={() => {
                            setFocusNum(false)
                            setFocusAddress(false)
                            setFocusName(false)
                            setFocusUtils(false)
                        }} className={styles.inputText} value={form.comment} onChange={(e) => setForm(prevState => ({...prevState, comment: e.target.value}))}/>
                    </label>
                    {form.type !== 'Нет контрольного события' ? <label>
                        Услуги
                        <input type="text" onFocus={() => {
                            setFocusNum(false)
                            setFocusAddress(false)
                            setFocusName(false)
                            setFocusUtils(true)
                        }} placeholder={'OC, ПС, и т.д'} className={styles.inputText} value={form.voText} onChange={(e) => setForm(prevState => ({...prevState, voText: e.target.value}))}/>
                        {focusUtils ? <div className={styles.utilsWrapper}>{utils.map(el => <label key={el} className={styles.utils}><input onChange={(e) => {
                            if (el.indexOf('Иное') === -1) {


                                if (e.target.checked) {
                                    const newVo = [...form.vo, el];
                                    setForm(prevState => ({...prevState, vo: [...form.vo, el], voText: newVo.join(',')}))
                                } else {

                                    const newVo = form.vo.filter(el2 => el2 !== el);

                                    setForm(prevState => ({...prevState, vo: form.vo.filter(el2 => el2 !== el), voText: newVo.join(',')}))
                                }


                            } else {
                                setForm(prevState => ({...prevState, vo: [...form.vo, el]}))
                            }
                        }} type="checkbox" checked={form.vo.indexOf(el) !== -1}/>{el}</label>)}</div> : null}
                    </label> : null }
                    {form.type !== 'Нет контрольного события' ? <label>
                        Дата выполнения
                        <input type="datetime-local" onFocus={() => {
                            setFocusNum(false)
                            setFocusAddress(false)
                            setFocusName(false)
                            setFocusUtils(false)
                        }} className={styles.inputText} value={form.date} onChange={(e) => setForm(prevState => ({...prevState, date: e.target.value}))}/>
                    </label> : null}
                    <div className={styles.flex_box}>
                        <label className={styles.checkbox}>

                            <input type="checkbox" checked={form.changeTech} onChange={() => setForm(prevState => ({...prevState, changeTech: !form.changeTech}))}/>
                            Запретить передавать
                        </label>
                        <label  className={styles.files}>
                            <input type="file" onChange={(e) => setForm(prevState => ({...prevState, files: e.target.files}))} multiple/>
                            {form.files.length ? `Загружено файлов: ${form.files.length}` : 'Выберите файлы'}
                        </label>
                    </div>
                    {customer.OBJ && customer !== 'loading' ? <PopUp data={customer} func={(a='',b='',c='',d='') => setForm(prevState => ({...prevState, name: a, address: b, clientFio: c, objNum: d})  )}/> : null}
                </div>
                {loading || customer === 'loading' ? <Loader/> : null}
            </div>
        </>


    );
}



export default CreateTask;
