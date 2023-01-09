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

  const [form, setForm] = useState({
    id: '',
    name: '',
    type1: '',
    type2: '',
    type3: '',
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

  const GetAllEquipment = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getAllEquipment.php`)
      .then(res => res.json())
      .then(data => setAllEquipment(data.items))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    GetAllEquipment();
    setUniqueEquipment(allEquipment.map(e => e.name).filter((v, i, a) => a.indexOf(v) === i));
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
                <td>{allEquipment.map(e => e = e.name).filter(c => c == el).length}</td>
              </tr>
            )}
          </table>
        </div>
        : null}

      {page === pages.equipmentCreate
        ? <div>
          
          <b>Тип оборудования:</b>
          <select className={styles.select} onChange={(e) => {
            setForm(prevState => ({ ...prevState, type1: e.target.value, name: "" }))
            console.log("Тип оборудования = "+form.type1)
          }}>
            {type1_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
            <option value="" selected disabled hidden>Выберите Тип Оборудования</option>
          </select>

          {form.type1 === "Охранные Блоки" ? <label> <b>Тип блока:</b>
            <select className={styles.select} onChange={(e) => {
              setForm(prevState => ({ ...prevState, type2: e.target.value, name: "Охранный Блок " + e.target.value + " №"}))
              console.log("Тип блока = "+form.type2)
            }}>
              {block_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
              <option value="" selected disabled hidden>Выберите Тип Блока</option>
            </select>
          </label>
            : null}

          <b>Наименование Оборудования:</b>
          <input className={styles.formInput} type="text" value={form.name} onChange={(e) => {
              setForm(prevState => ({ ...prevState, name: e.target.value }))}}></input>

          <b>Техник:</b>
          <select className={styles.select} onChange={(e) => {
            setForm(prevState => ({ ...prevState, techName: e.target.value }))
          }}>
            {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
            <option value="" selected disabled hidden>Выберите Техника</option>
          </select>

          <p></p>
          <button className={styles.submitButton} for="submitForm">Добавить оборудование</button>
        </div>
        : null}

    </div>
  )
}

export { Equipment };