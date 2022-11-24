import { useState, useEffect } from "react";
import styles from './Stats.module.scss';

const pages = {
  start: '/',
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
  const [objects, setObjects] = useState([]);
  const [res, setRes] = useState([]);

  useEffect(() => {
    if (page === pages.objectsWithoutSim) getObjectsWithExtFields(setObjects);
  }, [page])

  useEffect(() => {
    const withSim = Array.from(new Set(objects?.filter(el => el.ExtFieldName?.includes('Сим')).map(el => el.ObjectID)));
    const withoutSim = Array.from(new Set(objects?.filter(el => withSim.includes(el.ObjectID) === false).map(el => el.ObjectNumber)));
    setRes(withoutSim.map(el => objects?.find(obj => obj.ObjectNumber === el)));
  }, [objects])


  return (
    <div>
      <PageButton onClick={() => setPage(pages.objectsWithoutSim)}>{pages.objectsWithoutSim}</PageButton>

      {page === pages.objectsWithoutSim
        ? <div className={styles.objects}>
          {res?.map(el => <ObjectItem key={el.ObjectID} item={el} />)}
        </div>
        : null}
    </div>
  )
}

export { Stats };