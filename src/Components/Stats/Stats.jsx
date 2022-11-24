import { useState, useEffect } from "react";
import styles from './Stats.module.scss';

const pages = {
  start: '/',
  kpdByTech: 'КПД техников',
  objectsWithoutSim: 'Объекты без сим карт',

}

const getObjectsWithExtFields = (setObjects) => {
  fetch(`https://volga24bot.com/kartoteka/api/boq/andromedaObjects/getAllWithExtFields.php`)
    .then(res => res.json())
    .then(data => setObjects(data.map(object => ({
      ...object,
      ObjectNumber: Number(object.ObjectNumber).toString(16)
    })).sort((a, b) => (a.ObjectNumber - b.ObjectNumber))))
    .catch(e => console.log(e))
}

const ObjectItem = ({ item }) => {
  return (
    <div className={styles.objectItem}>
      <div className={styles.info} >
        <p className={styles.pcoNumber}>{item.ObjectNumber}</p>
        <p className={styles.name}>{item.Name}</p>
        <p className={styles.address}>{item.Address}</p>
      </div>
    </div>
  )
}

const PageButton = ({ children, ...props }) => {
  return (
    <button className={styles.pageButton} {...props} >{children}</button>
  )
}

const Stats = () => {
  const [page, setPage] = useState(pages.start);

  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [kpds, setKpds] = useState([]);

  const [objects, setObjects] = useState([]);
  const [res, setRes] = useState([]);


  const GetKpdByTech = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getKpdByTech.php?startDate=${startDate}&endDate=${endDate}`)
      .then(res => res.json())
      .then(data => setKpds(data.items))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getObjectsWithExtFields(setObjects);
  }, [])

  useEffect(() => {
    const withSim = Array.from(new Set(objects?.filter(el => el.ExtFieldName?.includes('Сим')).map(el => el.ObjectID)));
    const withoutSim = Array.from(new Set(objects?.filter(el => withSim.includes(el.ObjectID) === false).map(el => el.ObjectNumber)));
    setRes(withoutSim.map(el => objects?.find(obj => obj.ObjectNumber === el)));
  }, [objects])


  return (
    <div>
      <PageButton onClick={() => setPage(pages.kpdByTech)}>{pages.kpdByTech}</PageButton>
      <PageButton onClick={() => setPage(pages.objectsWithoutSim)}>{pages.objectsWithoutSim}</PageButton>

      {page === pages.kpdByTech
        ?
        <>
          <div className={styles.chooseDate}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button onClick={GetKpdByTech}>Принять</button>
          </div>
          <div>
            <table border="1" cellpadding="3">
              <tr>
                <th>Техники</th>
                {Array.from(new Set(kpds?.map(el => el.createAt))).map(el => <th>{el}</th>)}
              </tr>
              {Array.from(new Set(kpds?.map(el => el.tech))).map(el =>
                <>
                  <tr>
                    <th>{el.split(' ')[0]}</th>
                    {kpds?.filter(kpd => kpd.tech === el).map(kpd => <th>{kpd.kpd}</th>)}
                  </tr>
                </>)}
            </table>
          </div>
        </>
        : null}

      {page === pages.objectsWithoutSim
        ? <div className={styles.objects}>
          {res?.map(el => <ObjectItem key={el.ObjectID} item={el} />)}
        </div>
        : null}
    </div>
  )
}

export { Stats };