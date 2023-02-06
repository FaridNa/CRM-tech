import { useState, useEffect } from "react";
import styles from './Equipment.module.scss';

import EquipmentPopUp from "./EquipmentPopUp";

import { IoIosRefresh } from 'react-icons/io';

const Equipment = () => {


  const [info, setInfo] = useState(false);

  const [create, setCreate] = useState(false);

  const [editStatus, setEditStatus] = useState(false);;

  const [allEquipment, setAllEquipment] = useState([]);

  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const [sortedEquipment, setSortedEquipment] = useState([]);

  const [sortType, setSortType] = useState("id");

  const [oldSortType, setOldSortType] = useState("id");

  const [refresh, setRefresh] = useState(0);

  const setSort = (newSortType) => {
    setOldSortType(sortType);
    setSortType(newSortType);
  }

  const GetUniqueEquipment = (equipment) => {
    console.log(allEquipment);
    return equipment.map(e => e.type2).filter((v, i, a) => a.indexOf(v) === i)
  }

  const GetAllEquipment = async () => {
    await fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getAllEquipment.php`)
      .then(res => res.json())
      .then(data => setAllEquipment(data.items))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    if (create === false) {
      GetAllEquipment().
        catch(console.error);
      console.log("update!!!");
    } else if (editStatus === false) {
      GetAllEquipment().
        catch(console.error);
      console.log("update!!!");
    }
  }, [create, editStatus, refresh])

  return (
    <div>

      {/* ANCHOR - Таблица  */}
      <div className={styles.equipmentView}>
        {/* <b>Количество Выданного Инвентаря</b>
          <table>
            <tr>
              <th scope="col">Тип</th>
              <th scope="col">Вид</th>
              <th scope="col">Количество</th>
            </tr>
            {GetUniqueEquipment(allEquipment).map(el =>
              <tr key={el}>
                <td>{allEquipment.find(e => e.type2 === el).type1}</td>
                <td>{el}</td>
                <td>{allEquipment.map(e => e = e.type2).filter(c => c == el).length}</td>
              </tr>
            )}
            </table> */}

        <div className={styles.title}>
          <span onClick={e => setRefresh(refresh+1)}><IoIosRefresh/>Инвентарь</span>
          <button onClick={e => setCreate(true)}>+ Добавить</button>
          {create ? <EquipmentPopUp method="create" close={(a) => setCreate(a)} /> : null}
        </div>
        
        <table>
          <tr>
            <th scope="col" onClick={e => sortType !== "type1" ? setSort("type1") : setSortType(oldSortType)}>Тип</th>
            <th scope="col" onClick={e => sortType !== "type2" ? setSort("type2") : setSortType(oldSortType)}>Вид</th>
            <th scope="col" onClick={e => sortType !== "name" ? setSort("name") : setSortType(oldSortType)}>Полное Название</th>
            <th scope="col" onClick={e => sortType !== "description" ? setSort("description") : setSortType(oldSortType)}>Описание</th>
            <th scope="col" onClick={e => sortType !== "id" ? setSort("id") : setSortType(oldSortType)}>Когда создан</th>
            <th scope="col" onClick={e => sortType !== "status" ? setSort("status") : setSortType(oldSortType)}>Статус</th>
            <th scope="col" onClick={e => sortType !== "techName" ? setSort("techName") : setSortType(oldSortType)}>Ответственный</th>
          </tr>
          {allEquipment.sort((a, b) => (a[sortType] > b[sortType]) ? 1 : ((b[sortType] > a[sortType]) ? -1 : 0)).map(el =>
            <tr key={el.name}>
              <td>{el.type1}</td>
              <td>{el.type2}</td>
              <td className={styles.tdEquipmentName} onClick={e => { setSelectedEquipment(el); setInfo(true); console.log(el) }}>{el.name}</td>
              <td>{el.description}</td>
              <td>{JSON.parse(el.history)?.filter(item => item.type === "create")?.filter(item => item.date !== null)[0]?.date} </td>
              <td>
                {el.status === "Установлен" ? <div style={{ backgroundColor: 'green' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                  el.status === "Создан" ? <div style={{ backgroundColor: '#003366' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                    el.status === "Выдан" ? <div style={{ backgroundColor: '#f77f00' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                      el.status === "Утерян" ? <div style={{ backgroundColor: '#d62828' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                        el.status === "Возвращен" ? <div style={{ backgroundColor: '#023047' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> : null}</td>
              <td >{el.techName}</td>
            </tr>
          )}
        </table>

        {info ? <EquipmentPopUp method="info" close={(a) => setInfo(a)} item={selectedEquipment} /> : null}
        {editStatus ? <EquipmentPopUp method="editStatus" close={(a) => setEditStatus(a)} item={selectedEquipment} /> : null}
      </div>

    </div>
  )
}

export { Equipment };