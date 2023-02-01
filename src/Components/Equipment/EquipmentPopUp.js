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


const EquipmentPopUp = ({ method, close, item }) => {


    const user = useStore($user);
    const dep = useStore($depStatus);

    const user_name = user.NAME + " " + user.LAST_NAME + " " + user.SECOND_NAME;

    const [form, setForm] = useState({
        id: '',
        name: '',
        type: '',
        type1: '',
        type2: '',
        type3: '',
        description: '',
        status: '',
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
        { value: 'Прочее', label: 'Прочее' }
    ]

    const block_options = [
        { value: 'Си-Норд', label: 'Си-Норд' },
        { value: 'Неман', label: 'Неман' },
        { value: 'Струна', label: 'Струна' },
        { value: 'Ларс', label: 'Ларс' }
    ]

    //Закрыть это Всплывающее Окно
    const closePopUp = (element) => {
        element.stopPropagation()
        close(false)
    }

    return (
        // Дивы, отвечающие за размер Всплывающего Окна
        <div className={styles.wrapper}> <div className={styles.popUpWrapper}> <div className={styles.closeWrapper} onClick={(e) => { closePopUp(e); }}><img src={Close} alt="" /></div>


            {/* МЕТОД - Создание объекта */}
            {method === "create" ?

                <div className={styles.equipmentCreate}>
                    <b>Вид оборудования:</b>
                    <select onChange={(e) => {
                        setForm(prevState => ({ ...prevState, type: e.target.value, name: "" }))
                        console.log("Вид оборудования = " + form.type)
                    }}>
                        {type_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                        <option value="" selected disabled hidden>Выберите Вип Оборудования</option>
                    </select>

                    {form.type !== "" ? <div>
                        <b>Тип оборудования:</b>
                        <select onChange={(e) => {
                            setForm(prevState => ({ ...prevState, type1: e.target.value, name: "" }))
                            console.log("Тип оборудования = " + form.type1)
                        }}>
                            {form.type === "Монтажные" ? montazh_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {form.type === "Инструменты" ? instrument_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {form.type === "Расходники" ? rashodnik_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            <option value="" selected disabled hidden>Выберите Тип Оборудования</option>
                        </select>

                        {form.type1 === "Охранные Блоки" ? <label> <b>Тип блока:</b>
                            <select onChange={(e) => {
                                setForm(prevState => ({ ...prevState, type2: e.target.value, name: "Охранный Блок " + e.target.value + " №" }))
                                console.log("Тип блока = " + form.type2)
                            }}>
                                {block_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                                <option value="" selected disabled hidden>Выберите Тип Блока</option>
                            </select>
                        </label>
                            : null}

                        <b>Наименование Оборудования:</b>
                        <input type="text" value={form.name} onChange={(e) => {
                            setForm(prevState => ({ ...prevState, name: e.target.value }))
                        }}></input>

                        <b>Доп. Описание:</b>
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
                        await createEquipment(form, user) ?
                            closePopUp(e)
                            : console.log("Ошибка создания")
                    }}>Выдать оборудование</button>
                </div>
                : null}


            {/* МЕТОД - Информация об объекте */}
            {method === "info" ?
                <div className={styles.equipmentInfo}>
                    <div className={styles.block} onClick={(e) => console.log(222)}>
                        <p className={styles.title}>{item.name}</p>
                        <p>Тип: {item.type1}{item.type2 ? "/" + item.type2 : ""}{item.type3 ? "/" + item.type3 : ""}</p>
                        <p>Описание: {item.description}</p>
                        <p>Статус: {item.status === "Создан" ? "Недавно создан" : ""}</p>
                        <p>Закреплен за: {item.techName}</p>
                    </div>

                    <div className={styles.block}>
                        <p className={styles.title}>История:</p>
                        {JSON.parse(item.history)?.map(el =>
                            el.type === "create" ? <p> <span style={{ color: '#003366' }}>Создано:</span> {el.date} ({el.user}) </p> :
                                el.type === "install" ? <p> <span style={{ color: 'green' }}>Установлено:</span> {el.date} ({el.user}) </p> :
                                    el.type === "equip" ? <p> <span style={{ color: 'yellow' }}>Экипировано:</span> {el.date} ({el.user}) </p> : null
                        )}
                    </div>
                </div>
                : null}

            {method === "editStatus" ?
                <div className={styles.equipmentEditStatus}>
                    
                    <p>Статус: {item.status}</p>
                    <p>{item.name}</p>
                    <p>Закреплен за: {item.techName}</p>
                    
                    <button style={{ backgroundColor: '#f77f00' }}>Выдан </button>
                    <button style={{ backgroundColor: '#d62828' }}>Утерян </button>
                    <button style={{ backgroundColor: '#023047' }}>Возвращен </button>

                </div> : null}


        </div></div>);
};

export default EquipmentPopUp;