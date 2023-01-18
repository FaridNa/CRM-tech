import { getAllByAltText } from "@testing-library/react";
import { useState, useEffect } from "react";
import styles from './Equipment.module.scss';
import { $user } from "../../state/user";
import { $depStatus } from "../../state/user";
import { useStore } from "effector-react";
import { createEquipment } from "../../actions/CreateEquipment";

const pages = {
  start: '/',
  equipmentView: 'Просмотр Инвентаря',
  equipmentCreate: 'Выдать Инвентарь'
}

const Equipment = () => {
  const user = useStore($user);
  const dep = useStore($depStatus);

  const user_name = user.NAME + " " + user.LAST_NAME + " " + user.SECOND_NAME;

  const [page, setPage] = useState(pages.start);

  const [allEquipment, setAllEquipment] = useState([]);

  const [form, setForm] = useState({
    id: '',
    name: '',
    type1: '',
    type2: '',
    type3: '',
    description: '',
    status: '',
    techName: '',
    brak: '',
    history: ''
  });

  const type1_options = [
    { value: 'Охранные Блоки', label: 'Охранные Блоки' },
    { value: 'Расходники для охранных блоков', label: 'Расходники для охранных блоков' },
    { value: 'Кабели', label: 'Кабели' },
    { value: 'Ключи', label: 'Ключи' },
    { value: 'Видеокамеры', label: 'Видеокамеры' },
    { value: 'Прочее', label: 'Прочее' }
  ]

  const block_options = [
    { value: 'Cnord', label: 'Cnord' },
    { value: 'Неман', label: 'Неман' },
    { value: 'Струна', label: 'Струна' },
    { value: 'Ларс', label: 'Ларс' }
  ]

  const PageButton = ({ children, ...props }) => {
    return (
      <button className={styles.pageButton} {...props} >{children}</button>
    )
  }

  const GetUniqueEquipment = (equipment) => {
    console.log(allEquipment);
    return equipment.map(e => e.type2).filter((v, i, a) => a.indexOf(v) === i)
  }

  useEffect(() => {
    const GetAllEquipment = async () => {
      await fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getAllEquipment.php`)
        .then(res => res.json())
        .then(data => setAllEquipment(data.items))
        .catch(e => console.log(e))
    }

    GetAllEquipment().
      catch(console.error);
  }, [page])

  return (
    <div>
      <PageButton onClick={() => setPage(pages.equipmentView)}>{pages.equipmentView}</PageButton>
      <PageButton onClick={() => setPage(pages.equipmentCreate)}>{pages.equipmentCreate}</PageButton>

      {page === pages.equipmentView
        ? <div className={styles.pageEquipmentView}>
          <b>Количество Выданного Инвентаря</b>
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
          </table>

          <b>Полный Список Выданного Инвентаря</b>
          <table>
            <tr>
              <th scope="col">Тип</th>
              <th scope="col">Вид</th>
              <th scope="col">Полное Название</th>
              <th scope="col">Закреплен за техником</th>
            </tr>
            {allEquipment.map(el =>
              <tr key={el.name}>
                <td>{el.type1}</td>
                <td>{el.type2}</td>
                <td className={styles.tdEquipmentName} onClick={e => console.log(222)}>{el.name}</td>
                <td>{el.techName}</td>
              </tr>
            )}
          </table>
        </div>
        : null}

      {page === pages.equipmentCreate
        ? <div className={styles.pageEquipmentCreate}>
          <b>Тип оборудования:</b>
          <select onChange={(e) => {
            setForm(prevState => ({ ...prevState, type1: e.target.value, name: "" }))
            console.log("Тип оборудования = " + form.type1)
          }}>
            {type1_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
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

          <b>Техник:</b>
          <select onChange={(e) => {
            setForm(prevState => ({ ...prevState, techName: e.target.value }))
          }}>
            {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
            <option value="" selected disabled hidden>Выберите Техника</option>
          </select>

          <p></p>
          <button onClick={async () => {
            await createEquipment(form, user) ?
              setPage(pages.equipmentView)
              : console.log("Ошибка создания")
          }}>Выдать оборудование</button>
        </div>
        : null}

    </div>
  )
}

export { Equipment };