import React from 'react';
import styles from './EquipmentPopUp.module.scss'
import Close from '../../img/close.png'

const EquipmentPopUp = ({ item, close }) => {

    const closePopUp = (element) => {
        element.stopPropagation()
        close(false)
    }

    //console.log(item.history.substring(1,item.history.length-1).split(','))

    const history = JSON.parse(item.history);

    return (
        <div className={styles.wrapper} onClick={(e) => closePopUp(e)}>
            <div className={styles.popUpWrapper}>
                <div className={styles.closeWrapper} onClick={(e) => { closePopUp(e); }}><img src={Close} alt="" /></div>
                <div className={styles.block} onClick={(e) => console.log(222)}>
                    <p className={styles.title}>{item.name}</p>
                    <p>Тип: {item.type1}{item.type2 ? "/" + item.type2 : ""}{item.type3 ? "/" + item.type3 : ""}</p>
                    <p>Описание: {item.description}</p>
                    <p>Статус: {item.status === "Создан" ? "Недавно создан" : ""}</p>
                    <p>Закреплен за: {item.techName}</p>
                </div>

                <div className={styles.block}>
                    <p className={styles.title}>История:</p>
                    {history.map(el => <p> {el.type === "create" ? "Создано"
                        : el.type === "install" ? "Установлено"
                            : el.type}:
                        {el.date} ({el.user}) </p>
                    )}

                </div>

            </div>
        </div>
    );
};

export default EquipmentPopUp;