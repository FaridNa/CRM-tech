import styles from './TableStats.module.scss';

const TableStats = ({ sd, ed, stats }) => {
  const techs = Array.from(new Set(stats?.kpds?.map(el => el.tech)));
  const days = Array.from(new Set(stats?.kpds?.map(el => el.createAt)));

  const colorKpd = (kpd) => {
    if (+kpd >= 70) return { 'background-color': 'lightgreen' };
    if (+kpd <= 30) return { 'background-color': 'lightsalmon' };
    return { 'background-color': 'white' };
  }

  const filtredArray = (tech, arr) => {
    return arr.filter(item => item.tech === tech)
      .filter(item => (new Date(item.createAt).getDay() !== 6
        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0');
  }

  const columns = ['ФИО', 'Сред', 'Макс', 'Мин', 'Претензии', 'Повторы', 'Не выполненные', 'Прогулы'];
  const Average = (tech, arr) => {
    const filtredArr = filtredArray(tech, arr);
    return (filtredArr.reduce((a, b) => a + +b.kpd, 0) / filtredArr.length).toFixed(1);
  }
  const Absense = (tech, arr) => {
    const filtredArr = filtredArray(tech, arr);
    return filtredArr.filter(item => item.kpd === '0').length;
  }

  return (
    <table className={styles.tableKpd} border="1" cellpadding="3" >
      <tr className={styles.tr}>{columns.map(column => <th>{column}</th>)}</tr>
      {techs.map(tech =>
        <tr>
          <th>{tech}</th>
          <th style={colorKpd(Average(tech, stats?.kpds))}>{Average(tech, stats?.kpds)}</th>
          <th style={colorKpd(Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))}>
            {Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd))}</th>
          <th style={colorKpd(Math.min(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))}>
            {Math.min(...filtredArray(tech, stats?.kpds).map(item => +item.kpd))}</th>
          <th>{stats?.pretensions.filter(p => p.plane_techs.includes(tech)).length}</th>
          <th>{stats?.repeats.filter(p => p.plane_techs.includes(tech)).length}</th>
          <th>{stats?.notCompleted.filter(p => p.plane_techs.includes(tech)).length}</th>
          <th>{Absense(tech, stats?.kpds)}</th>
        </tr>)}
    </table>
  )
}

export default TableStats;