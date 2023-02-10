import styles from './Equipment.module.scss';

import { useState, useEffect } from "react";
import { useStore } from "effector-react";

import { $user, $depStatus } from "../../state/user";

import EquipmentPopUp from "./EquipmentPopUp";
import { deleteEquipment } from "../../actions/DeleteEquipment";

import { IoIosRefresh } from 'react-icons/io';
import { GiTrashCan, GiLightBackpack } from "react-icons/gi";
import { TiArrowBack } from "react-icons/ti";

const Equipment = () => {

  const user = useStore($user);
  const dep = useStore($depStatus);

  const [showPage, setShowPage] = useState("equipmentView");

  const [repairKitTechName, setRepairKitTechName] = useState(false);

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
      {showPage === "equipmentView" ? <div className={styles.equipmentView}>

        <div className={styles.title}>
          <span onClick={e => setRefresh(refresh + 1)}><IoIosRefresh />Инвентарь</span>
          <button onClick={e => setCreate(true)}>+ Добавить</button>
          <button className={styles.buttonRepairKit} onClick={e => setShowPage("repairKitView")}><GiLightBackpack /> РемКомплект</button>
          {create ? <EquipmentPopUp method="create" close={(a) => setCreate(a)} /> : null}
        </div>

        <table>
          <tr>
            <th scope="col" onClick={e => sortType !== "type" ? setSort("type") : setSortType(oldSortType)}>Тип</th>
            <th scope="col" onClick={e => sortType !== "type1" ? setSort("type1") : setSortType(oldSortType)}>Вид</th>
            <th scope="col" onClick={e => sortType !== "name" ? setSort("name") : setSortType(oldSortType)}>Полное Название</th>
            <th scope="col" onClick={e => sortType !== "zayavkaNumber" ? setSort("zayavkaNumber") : setSortType(oldSortType)}>№ Заявки</th>
            {/* <th scope="col" onClick={e => sortType !== "payMethod" ? setSort("payMethod") : setSortType(oldSortType)}>Вид Оплаты</th> */}
            <th scope="col" onClick={e => sortType !== "description" ? setSort("description") : setSortType(oldSortType)}>Описание</th>
            <th scope="col" onClick={e => sortType !== "id" ? setSort("id") : setSortType(oldSortType)}>Когда создан</th>
            <th scope="col" onClick={e => sortType !== "status" ? setSort("status") : setSortType(oldSortType)}>Статус</th>
            <th scope="col" onClick={e => sortType !== "techName" ? setSort("techName") : setSortType(oldSortType)}>Ответственный</th>
            <th scope="col" className={styles.thDelete}><GiTrashCan /></th>
          </tr>
          {allEquipment.filter(el => el.status !== "Удален" && el.type !== "РемКомплект").sort((a, b) => (a[sortType] > b[sortType]) ? 1 : ((b[sortType] > a[sortType]) ? -1 : 0)).map(el =>
            <tr key={el.name}>
              <td>{el.type}</td>
              <td>{el.type1}</td>
              <td className={styles.tdEquipmentName} onClick={e => { setSelectedEquipment(el); setInfo(true); console.log(el) }}>{el.name}</td>
              <td>{el.zayavkaNumber}</td>
              {/* <td>{el.payMethod}</td> */}
              <td>{el.description}</td>
              <td>{JSON.parse(el.history)?.filter(item => item.type === "create")?.filter(item => item.date !== null)[0]?.date} </td>
              <td>
                {el.status === "Установлен" ? <div style={{ backgroundColor: 'green' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                  el.status === "Создан" ? <div style={{ backgroundColor: '#003366' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                    el.status === "Выдан" ? <div style={{ backgroundColor: '#f77f00' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                      el.status === "Утерян" ? <div style={{ backgroundColor: '#d62828' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> :
                        el.status === "Возвращен" ? <div style={{ backgroundColor: '#023047' }} className={styles.tdDivEquipmentStatus} onClick={e => { setSelectedEquipment(el); setEditStatus(true); console.log(el) }}>{el.status}</div> : null}</td>
              <td >{el.techName}</td>
              <td className={styles.tdDelete} onClick={e => deleteEquipment(el.id, user)}><GiTrashCan /></td>
            </tr>
          )}
        </table>

        {info ? <EquipmentPopUp method="info" close={(a) => setInfo(a)} item={selectedEquipment} /> : null}
        {editStatus ? <EquipmentPopUp method="editStatus" close={(a) => setEditStatus(a)} item={selectedEquipment} /> : null}
      </div> : null}


      {/* ANCHOR -  РемКомплект */}
      {showPage === "repairKitView" ? <div className={styles.repairKitView}>

        <div className={styles.title}>
          <span className={styles.backButton} onClick={e => setShowPage("equipmentView")}>
            <TiArrowBack style={{ "verticalAlign": "text-top" }} />
          </span>
          <select onChange={(e) => {
            setRepairKitTechName(e.target.value);
          }}>
            {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
            <option value="Иралиев Фарид Апахович">{"Иралиев Фарид Апахович"}</option>
            <option value="" selected disabled hidden>Выберите Техника</option>
          </select>

          {/* <span onClick={e => setRefresh(refresh + 1)}><IoIosRefresh />Ремонтный Комплект</span> */}
        </div>

        <table>
          <tr>
            <th scope="col" onClick={e => sortType !== "type" ? setSort("type") : setSortType(oldSortType)}>Тип</th>
            <th scope="col" onClick={e => sortType !== "type1" ? setSort("type1") : setSortType(oldSortType)}>Вид</th>
            <th scope="col" onClick={e => sortType !== "techName" ? setSort("techName") : setSortType(oldSortType)}>Количество</th>
          </tr>
          {allEquipment.filter(el => el.status !== "Удален" && el.techName === repairKitTechName && el.type === "РемКомплект").sort((a, b) => (a[sortType] > b[sortType]) ? 1 : ((b[sortType] > a[sortType]) ? -1 : 0)).map(el =>
            <tr key={el.name}>
              <td>{el.type}</td>
              <td>{el.type1}</td>
              <td className={styles.tdEquipmentName} onClick={e => { setSelectedEquipment(el); setInfo(true); console.log(el) }}>{el.name}</td>
            </tr>
          )}
        </table>

        {info ? <EquipmentPopUp method="info" close={(a) => setInfo(a)} item={selectedEquipment} /> : null}
        {editStatus ? <EquipmentPopUp method="editStatus" close={(a) => setEditStatus(a)} item={selectedEquipment} /> : null}
      </div> : null}


    </div>
  )
}

export { Equipment };