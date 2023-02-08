import React from 'react';
import styles from './EquipmentPopUp.module.scss'
import Close from '../../img/close.png'
import { $user } from "../../state/user";
import { $depStatus } from "../../state/user";
import { useStore } from "effector-react";
import { createEquipment } from "../../actions/CreateEquipment";
import { setShowTask } from "../../state/showTask";
import { getAllByAltText } from "@testing-library/react";
import { useState } from 'react';
import { editEquipment } from '../../actions/EditEquipment';

import { MdSell, MdOutlineMonetizationOn, MdAttachment, MdAutoAwesomeMotion } from "react-icons/md";


const EquipmentPopUp = ({ method, close, item }) => {


    const user = useStore($user);
    const dep = useStore($depStatus);


    const user_name = user.NAME + " " + user.LAST_NAME + " " + user.SECOND_NAME;

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [noBlockNumberCheck, setNoBlockNumberCheck] = useState(false);

    const [form, setForm] = useState({
        id: '',
        name: '',
        type: '',
        type1: '',
        type2: '',
        payMethod: '',
        description: '',
        quantity: '',
        status: '',
        zayavkaNumber: '',
        blockNumber: '',
        techName: '',
        brak: '',
        history: ''
    });

    const type_options = [
        { value: 'Монтажные', label: '🛠️ Монтажные' },
        { value: 'Инструменты', label: '🧰 Инструменты' },
        { value: 'Расходники', label: '🧷 Расходники' }
    ]

    const montazh_options = [
        { value: 'Охранные Блоки', label: '🔒 Охранные Блоки' },
        { value: 'Видеокамеры', label: '🎥 Видеокамеры' },
        { value: 'Датчики', label: '🌡️ Датчики' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    const instrument_options = [
        { value: 'Измерительные приборы', label: '📐 Измерительные приборы' },
        { value: 'Ручные инструменты', label: '🔨 Ручные инструменты' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    const rashodnik_options = [
        { value: 'Аккумуляторы', label: '🔋 Аккумуляторы' },
        { value: 'Ключи', label: '🔑 Ключи' },
        { value: 'Кабели', label: '🔌 Кабели' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    const block_options = [
        { value: 'Си-Норд', label: 'Си-Норд' },
        { value: 'Неман', label: 'Неман' },
        { value: 'Струна', label: 'Струна' },
        { value: 'Ларс', label: 'Ларс' },
        { value: 'Другой', label: 'Другой' }
    ]

    const sensor_options = [
        { value: 'Астра-8', label: 'Астра-8' },
        { value: 'Другой', label: 'Другой' }
    ]

    const short_names = {
        "Охранные блоки": "Охранный Блок",
        "Видеокамеры": "Видеокамера",
        "Датчики": "Датчик",
        "Измерительные приборы": "Измерительный прибор",
        "Ручные инструменты": "Ручной инструмент",
        "Аккумуляторы": "Аккумулятор",
        "Ключи": "Ключ",
        "Кабели": "Кабель",
    }

    //React Icons for older browsers
    // FaWrench
    // FaToolbox
    // FaPaperclip

    // FaLock
    // FaCameraRetro

    // FaRulerCombined
    // FaHammer

    // FaCarBattery
    // FaKey


    const info_history = (item) => {
        const history_paragraphs = {
            create: <span style={{ color: '#003366' }}>Создано</span>,
            install: <span style={{ color: 'green' }}>Установлено</span>,
            equip: <span style={{ color: 'yellow' }}>Экипировано</span>,

            //Статусы:
            Выдан: <span style={{ color: '#f77f00' }}>Выдано</span>,
            Утерян: <span style={{ color: '#d62828' }}>Утеряно</span>,
            Возвращен: <span style={{ color: '#023047' }}>Возвращено</span>
        }

        return (JSON.parse(item.history)?.map(el =>
            <div>
                {el.type === "editStatus" ? history_paragraphs[el.value.status] : history_paragraphs[el.type]}
                <span style={{ float: "right" }}>{el.date}</span>
            </div>
        ))
    }

    //Закрыть это Всплывающее Окно
    const closePopUp = (element) => {
        element.stopPropagation()
        close(false)
    }

    return (
        // Дивы, отвечающие за размер Всплывающего Окна
        <div className={styles.wrapper}> <div className={styles.popUpWrapper}> <div className={styles.closeWrapper} onClick={(e) => { closePopUp(e); }}><img src={Close} alt="" /></div>

            {/* ANCHOR - МЕТОД - Информация об объекте */}
            {method === "info" ?
                <div className={styles.equipmentInfo}>
                    <div className={styles.block}>
                        <p className={styles.title}>{item.name}</p>
                        <p>Тип: {item.type1}{item.type2 ? "/" + item.type2 : ""}</p>
                        <p>Описание: {item.description}</p>
                        <p>Статус: {item.status === "Создан" ? "Недавно создан" : ""}</p>
                        <p>Закреплен за: {item.techName}</p>
                        <p>Номер Блока: {item.blockNumber}</p>
                    </div>

                    <div className={styles.block}>
                        <p className={styles.title}>История:</p>
                        {info_history(item)}

                    </div>
                </div>
                : null}

            {/* ANCHOR - МЕТОД - Создание объекта */}
            {method === "create" ?
                <div className={styles.equipmentCreate}>
                    <b>Вид оборудования:</b>
                    <select onChange={(e) => {
                        setForm(prevState => ({ ...prevState, type: e.target.value, name: "", type1: "", type2: "" }))
                    }}>
                        {type_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                        <option value="" selected disabled hidden>Выберите Вип Оборудования</option>
                    </select>

                    {form.type !== "" ? <div>
                        <b>Тип оборудования:</b>
                        <select onChange={(e) => {
                            setForm(prevState => ({ ...prevState, type1: e.target.value, name: short_names[e.target.value] }))
                        }}>
                            {form.type === "Монтажные" ? montazh_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {form.type === "Инструменты" ? instrument_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {form.type === "Расходники" ? rashodnik_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            <option value="" selected disabled hidden>Выберите Тип Оборудования</option>
                        </select>


                        {form.type1 === "Охранные Блоки" ? <div> <b>Тип блока:</b>
                            <select onChange={(e) => {
                                setForm(prevState => ({ ...prevState, type2: e.target.value, name: e.target.value + " №" }))
                                console.log("Тип блока = " + form.type2)
                            }}>
                                {block_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                                <option value="" selected disabled hidden>Выберите Тип Блока</option>
                            </select>
                        </div>
                            : null}

                        {form.type1 === "Датчики" ? <div> <b>Тип блока:</b>
                            <select onChange={(e) => {
                                setForm(prevState => ({ ...prevState, type2: e.target.value, name: e.target.value + " №" }))
                                console.log("Тип датчика = " + form.type2)
                            }}>
                                {sensor_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                                <option value="" selected disabled hidden>Выберите Тип Датчика</option>
                            </select>
                        </div>
                            : null}


                        {form.type === "Расходники" ? <div>
                            <b>Количество:</b>
                            <div className={styles.rashodnikQuantity}>
                                <label style={{ "color": form.quantity === "Единичный" ? "#003366" : "grey", "borderColor": form.quantity === "Единичный" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Единичный" name="quantity" checked={form.quantity === 'Единичный'} onChange={(e) => setForm((prevState) => ({ ...prevState, quantity: e.target.value }))} />
                                    <MdAttachment style={{ "padding-right": "0.1rem" }} />Единичный
                                </label>
                                <label style={{ "color": form.quantity === "Множественный" ? "#003366" : "grey", "borderColor": form.quantity === "Множественный" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Множественный" name="quantity" checked={form.quantity === 'Множественный'} onChange={(e) => setForm((prevState) => ({ ...prevState, quantity: e.target.value }))} />
                                    <MdAutoAwesomeMotion style={{ "padding-right": "0.1rem" }} />Множественный
                                </label>
                            </div> </div>
                            : null}

                        <b>Наименование Оборудования:</b>
                        <input type="text" value={form.name} onChange={(e) => {
                            setForm(prevState => ({ ...prevState, name: e.target.value }))
                        }}></input>

                        <b>Номер Заявки*:</b>
                        <input style={{ "width": "20%" }} type="text" value={form.zayavkaNumber} onChange={(e) => {
                            if (/^\d+$/.test(e.target.value) || e.target.value.length === 0) {
                                setForm(prevState => ({ ...prevState, zayavkaNumber: e.target.value }))
                            }
                        }}></input>

                        <b>Вид оплаты*:</b>
                        <div className={styles.divPayMethod}>
                            <label style={{ "color": form.payMethod === "Оплачено" ? "#003366" : "grey", "borderColor": form.payMethod === "Оплачено" ? "#003366" : "grey" }}>
                                <input type="radio" value="Оплачено" name="payMethod" checked={form.payMethod === 'Оплачено'} onChange={(e) => setForm((prevState) => ({ ...prevState, payMethod: e.target.value }))} />
                                <MdSell style={{ "padding-right": "0.1rem" }} />Оплачено
                            </label>
                            <label style={{ "color": form.payMethod === "Аренда" ? "#003366" : "grey", "borderColor": form.payMethod === "Аренда" ? "#003366" : "grey" }}>
                                <input type="radio" value="Аренда" name="payMethod" checked={form.payMethod === 'Аренда'} onChange={(e) => setForm((prevState) => ({ ...prevState, payMethod: e.target.value }))} />
                                <MdOutlineMonetizationOn style={{ "padding-right": "0.1rem" }} />Аренда
                            </label>
                        </div>

                        <b>Доп. Описание*:</b>
                        <input type="text" value={form.description} onChange={(e) => {
                            setForm(prevState => ({ ...prevState, description: e.target.value }))
                        }}></input>
                    </div> : null}

                    <b>Техник:</b>
                    <select onChange={(e) => {
                        setForm(prevState => ({ ...prevState, techName: e.target.value }))
                    }}>
                        {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
                        <option value="" selected disabled hidden>Выберите Техника</option>
                    </select>

                    <p></p>
                    <button onClick={async (e) => {
                        if (form.type === '') {
                            alert('Необходимо указать вид оборудования!!');
                            return;
                        } else if (form.type1 === '') {
                            alert('Необходимо указать тип оборудования!!');
                            return;
                        } else if (form.name === '') {
                            alert('Необходимо указать имя оборудования!!');
                            return;
                        } else if ((form.type1 === 'Охранные блоки' || form.type1 === 'Датчики') && form.type3 === '') {
                            alert('Необходимо указать тип блока/датчика!!');
                            return;
                        } else if (form.type === 'Расходники' && form.quantity === '') {
                            alert('Необходимо указать количество расходников!!');
                            return;
                        } else if (form.techName === '') {
                            alert('Необходимо указать техника!!');
                            return;
                        } else {
                            await createEquipment(form, user) ?
                                closePopUp(e)
                                : console.log("Ошибка создания")
                        }
                    }
                    }>Добавить оборудование</button>
                </div>
                : null}

            {/* ANCHOR - МЕТОД -Изменение Статуса */}
            {method === "editStatus" ?
                <div className={styles.equipmentEditStatus}>

                    <p>Статус: {item.status}</p>
                    <p>{item.name}</p>
                    <p>Закреплен за: {item.techName}</p>

                    {selectedStatus ? selectedStatus === "Выдан" ? <div>
                        <div style={{ width: '80%' }}>

                            {noBlockNumberCheck === false ? <div>
                                <p className={styles.title}>Введите номер блока:</p>
                                <input type="text" value={form.blockNumber} onChange={(e) => {
                                    setForm(prevState => ({ ...prevState, blockNumber: e.target.value }))
                                }}></input>
                            </div> : null}

                            <p className={styles.title} style={{ display: 'inline' }}>Без номера блока:</p>
                            <input className={styles.checkbox} type="checkbox" onClick={e => e.target.checked ? setNoBlockNumberCheck(true) : setNoBlockNumberCheck(false)}></input>
                        </div>
                        <button style={{ backgroundColor: '#f77f00' }} onClick={e => noBlockNumberCheck
                            ? editEquipment("editStatus", { id: item.id, status: 'Выдан', techName: item.techName, blockNumber: 0 }, user).then(closePopUp(e))
                            : editEquipment("editStatus", { id: item.id, status: 'Выдан', techName: item.techName, blockNumber: form.blockNumber }, user).then(closePopUp(e))
                        }>Выдать</button>
                    </div> : null : <div>
                        {item.status !== "Выдан" ?
                            <button style={{ backgroundColor: '#f77f00' }} onClick={e => setSelectedStatus("Выдан")}>Выдан </button> : null}
                        {item.status !== "Утерян" ?
                            <button style={{ backgroundColor: '#d62828' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Утерян', techName: item.techName }, user).then(closePopUp(e))}>Утерян </button> : null}
                        {item.status !== "Возвращен" ?
                            <button style={{ backgroundColor: '#023047' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Возвращен', techName: item.techName }, user).then(closePopUp(e))}>Возвращен </button> : null}
                    </div>}

                </div> : null}


        </div></div>);
};

export default EquipmentPopUp;