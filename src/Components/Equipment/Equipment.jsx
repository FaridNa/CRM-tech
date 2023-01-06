import { getAllByAltText } from "@testing-library/react";
import { useState, useEffect } from "react";
import styles from './Equipment.module.scss';
import { $user } from "../../state/user";
import { $depStatus } from "../../state/user";
import { useStore } from "effector-react";

const pages = {
  start: '/',
  equipmentView: 'Просмотр Инвентаря',
  equipmentCreate: 'Добавить Инвентарь'
}

const Equipment = () => {
  const user = useStore($user);
  const dep = useStore($depStatus);

  const user_name = user.NAME + " " + user.LAST_NAME + " " + user.SECOND_NAME;

  const [page, setPage] = useState(pages.start);

  const [allEquipment, setAllEquipment] = useState([]);
  const [uniqueEquipment, setUniqueEquipment] = useState([]);

  const PageButton = ({ children, ...props }) => {
    return (
      <button className={styles.pageButton} {...props} >{children}</button>
    )
  }

  const GetAllEquipment = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getAllEquipment.php`)
      .then(res => res.json())
      .then(data => setAllEquipment(data.items))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    GetAllEquipment();
    setUniqueEquipment(allEquipment.map(e => e.equipmentName).filter((v, i, a) => a.indexOf(v) === i));
  }, [page])

  return (
    <div>
      <PageButton onClick={() => setPage(pages.equipmentView)}>{pages.equipmentView}</PageButton>
      <PageButton onClick={() => setPage(pages.equipmentCreate)}>{pages.equipmentCreate}</PageButton>

      {page === pages.equipmentView
        ? <div>
          {/* <button onClick={c => console.log(dep)}> Нажми Меня </button> */}
          <h2></h2>
          <table>
            <tr>
              <th scope="col">Имя</th>
              <th scope="col">Количество</th>
            </tr>

            {uniqueEquipment.map(el =>
              <tr key={el}>
                <td>{el}</td>
                <td>{allEquipment.map(e => e = e.equipmentName).filter(c => c == el).length}</td>
              </tr>
            )}
          </table>
        </div>
        : null}

      {page === pages.equipmentCreate
        ? <div>
          <b>Выберите тип оборудования:</b>
          <p></p>

          <select className={styles.select} onChange={(e) => { }}>
            {uniqueEquipment.map(el => <option value={el} key={el}>{el}</option>)}
            <option value="" selected disabled hidden >Выберите Оборудование</option>
          </select>

          <p></p>

          <select className={styles.select} onChange={(e) => { }}>
            {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
            <option value="" selected disabled hidden >Выберите Техника</option>
          </select>

          <p></p>

          <button>Добавить оборудование</button>
        </div>
        : null}

    </div>
  )
}

export { Equipment };