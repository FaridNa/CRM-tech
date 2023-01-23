import styles from './TableKpd.module.scss';

const TableKpd = ({ sd, ed, kpds }) => {
  const techs = Array.from(new Set(kpds?.map(el => el.tech)));
  const days = Array.from(new Set(kpds?.map(el => el.createAt)));

  const colorDay = (day) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return { 'background-color': 'lightblue' };
    return { 'background-color': 'white' };
  }
  const colorKpd = (day, kpd) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return;
    if (+kpd >= 70) return { 'background-color': 'lightgreen' };
    if (+kpd <= 30) return { 'background-color': 'lightsalmon' };
    return { 'background-color': 'white' };
  }

  return (
    <table className={styles.tableKpd} border="1" cellpadding="3" >
      <tr className={styles.tr}>
        <th style={{ 'width': 60 }}></th>
        {techs.map(tech => <th>{tech.split(' ')[0]}</th>)}
      </tr>

      {days.map(day =>
        <tr className={styles.tr} style={colorDay(day)}>
          <th className={styles.th}>{day.split('-')[2]}</th>
          {techs.map(tech => kpds?.filter(kpd => kpd.tech === tech && kpd.createAt === day).length === 1
            ? kpds?.filter(kpd => kpd.tech === tech && kpd.createAt === day)
              .map(kpd => <th className={styles.th} style={colorKpd(day, kpd.kpd)} >{kpd.kpd}</th>)
            : <th className={styles.th} >x</th>
          )}
        </tr>)}
    </table>
  )
}

export default TableKpd;