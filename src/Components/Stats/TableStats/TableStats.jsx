import styles from './TableStats.module.scss';

const TableStats = ({ sd, ed, stats }) => {
  const techs = Array.from(new Set(stats?.kpds?.map(el => el.tech)));
  const days = Array.from(new Set(stats?.kpds?.map(el => el.createAt)));

  const columns = ['ФИО', 'Сред', 'Макс', 'Мин', 'Претензии', 'Повторы', 'Не выполненые', 'Прогулы'];
  const Average = (tech, arr) => {
    const filtredArr = arr.filter(item => item.tech === tech)
      .filter(item => (new Date(item.createAt).getDay() !== 6
        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0');
    return (filtredArr.reduce((a, b) => a + +b.kpd, 0) / filtredArr.length).toFixed(1);
  }

  return (
    <table className={styles.tableKpd} border="1" cellpadding="3" >
      <tr className={styles.tr}>{columns.map(column => <th>{column}</th>)}</tr>
      {techs.map(tech =>
        <tr>
          <th>{tech}</th>
          <th>{Average(tech, stats?.kpds)}</th>
        </tr>)}
    </table>
  )
}

export default TableStats;