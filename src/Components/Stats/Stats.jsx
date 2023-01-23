import { useState, useEffect } from "react";
import styles from './Stats.module.scss';
import PageButton from "./PageButton/PageButton";
import TableKpd from "./TableKpd/TableKpd";
import TableStats from "./TableStats/TableStats";


// useEffect(() => {
//   getObjectsWithExtFields(setObjects);
// }, [])

// useEffect(() => {
//   const withSim = Array.from(new Set(objects?.filter(el => el.ExtFieldName?.includes('Сим')).map(el => el.ObjectID)));
//   const withoutSim = Array.from(new Set(objects?.filter(el => withSim.includes(el.ObjectID) === false).map(el => el.ObjectNumber)));
//   setRes(withoutSim.map(el => objects?.find(obj => obj.ObjectNumber === el)));
// }, [objects])

// const getObjectsWithExtFields = (setObjects) => {
//   fetch(`https://volga24bot.com/kartoteka/api/boq/andromedaObjects/getAllWithExtFields.php`)
//     .then(res => res.json())
//     .then(data => setObjects(data.map(object => ({
//       ...object,
//       ObjectNumber: Number(object.ObjectNumber).toString(16)
//     })).sort((a, b) => (a.ObjectNumber - b.ObjectNumber))))
//     .catch(e => console.log(e))
// }

// const ObjectItem = ({ item }) => {
//   return (
//     <div className={styles.objectItem}>
//       <div className={styles.info} >
//         <p className={styles.pcoNumber}>{item.ObjectNumber}</p>
//         <p className={styles.name}>{item.Name}</p>
//         <p className={styles.address}>{item.Address}</p>
//       </div>
//     </div>
//   )
// }

const pages = {
  page: '/',
  kpds: 'Статистика техников',
  // objectsWithoutSim: 'Объекты без сим карт',
}

const Stats = () => {
  // const [objects, setObjects] = useState([]);
  // const [res, setRes] = useState([]);

  const [page, setPage] = useState(pages.start);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [stats, setStats] = useState();

  const StatsHandler = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/Stats/getStats.php?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.error(e))
  }

  return (
    <div>
      <PageButton onClick={() => setPage(pages.kpds)}>{pages.kpds}</PageButton>
      {/* <PageButton onClick={() => setPage(pages.objectsWithoutSim)}>{pages.objectsWithoutSim}</PageButton> */}

      {page === pages.kpds
        ?
        <>
          <div className={styles.chooseDate}>
            <input type="date" valueAsDate={startDate} onChange={e => setStartDate(new Date(e.target.value))} />
            <input type="date" valueAsDate={endDate} onChange={e => setEndDate(new Date(e.target.value))} />
            <button onClick={StatsHandler}>Принять</button>
          </div>
          <h2>Ведомость за {startDate.toLocaleString('ru', { month: 'long' })} {startDate.getFullYear()}</h2>
          <table>
            <td><TableKpd sd={startDate} ed={endDate} kpds={stats?.kpds} /></td>
            <td><TableStats sd={startDate} ed={endDate} stats={stats} /></td>
          </table>
          {/* {countNotPlanedAndRepeats.cnp ?
            <span>Не распределенных задач: {countNotPlanedAndRepeats.cnp}</span>
            : null} */}
          {/* Введомость за {startDate.toLocaleString('ru', { month: 'long' })}
          <div>
            <table border="1" cellpadding="3">
              <tr>
                <th>Техники</th>
                <th>Претензии</th>
                {countNotPlanedAndRepeats.items
                  ? <th>Повторы</th>
                  : null}
                <th>Не выполненые</th>
                <th>Среднее</th>
                <th>Мин</th>
                <th>Макс</th>
                {Array.from(new Set(kpds?.map(el => el.createAt))).map(el =>
                  (new Date(el).getDay() === 6 || new Date(el).getDay() === 0)
                    ? <th><span style={{ "color": "blue" }}>{el}</span></th>
                    : <th>{el}</th>)}
              </tr>
              {Array.from(new Set(kpds?.map(el => el.tech))).map(el =>
                <tr>
                  <th>{el.split(' ')[0]}</th>
                  <th>
                    <span style={{ "color": "green" }}>
                      {pretension.filter(p => p.plane_techs.includes(el) && p.typeResult === 'Выполнена').length}
                    </span>
                    -
                    <span style={{ "color": "red" }}>
                      {pretension.filter(p => p.plane_techs.includes(el) && p.typeResult !== 'Выполнена').length}
                    </span>
                  </th>
                  {countNotPlanedAndRepeats.items
                    ? <th>
                      <span style={{ "color": "green" }}>
                        {countNotPlanedAndRepeats.items.filter(p => p.plane_techs.includes(el) && p.typeResult === 'Выполнена').length}
                      </span>
                      -
                      <span style={{ "color": "red" }}>
                        {countNotPlanedAndRepeats.items.filter(p => p.plane_techs.includes(el) && p.typeResult !== 'Выполнена').length}
                      </span>
                    </th>
                    : null}
                  <th>
                    {notComleted.filter(p => p.plane_techs.includes(el)).length}
                  </th>
                  <th>
                    {Average(kpds.filter(item => item.tech === el)
                      .filter(item => (new Date(item.createAt).getDay() !== 6
                        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0'))}
                  </th>
                  <th>
                    {Math.min(...kpds.filter(item => item.tech === el)
                      .filter(item => (new Date(item.createAt).getDay() !== 6
                        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0').map(item => +item.kpd))}
                  </th>
                  <th>
                    {Math.max(...kpds.filter(item => item.tech === el)
                      .filter(item => (new Date(item.createAt).getDay() !== 6
                        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0').map(item => +item.kpd))}
                  </th>
                  {kpds?.filter(kpd => kpd.tech === el).map(kpd => <th><span style={kpd.kpd >= 70 ? { "color": "green" } : kpd.kpd <= 20 ? { "color": "red" } : null}>{kpd.kpd}</span></th>)}
                </tr>
              )}
            </table>
          </div> */}
        </>
        : null}

      {/* {page === pages.objectsWithoutSim
        ? <div className={styles.objects}>
          {res?.map(el => <ObjectItem key={el.ObjectID} item={el} />)}
        </div>
        : null} */}
    </div>
  )
}

export { Stats };