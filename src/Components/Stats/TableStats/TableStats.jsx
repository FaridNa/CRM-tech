
const TableStats = ({ sd, ed, stats }) => {
  const techs = Array.from(new Set(stats?.kpds?.map(el => el.tech)));
  const days = Array.from(new Set(stats?.kpds?.map(el => el.createAt)));

  const colorKpd = (kpd) => {
    if (+kpd >= 70) return { 'backgroundColor': 'lightgreen' };
    if (+kpd <= 30) return { 'backgroundColor': 'lightsalmon' };
    return { 'backgroundColor': 'white' };
  }
  const stylesExcelKpd = (kpd) => {
    if (+kpd >= 70) return "90EE90";
    if (+kpd <= 30) return "ffa07a";
    return;
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
    <table border="1" cellPadding="3" >
      <thead>
        <tr>{columns.map(column => <th data-t="s" data-a-h="center" key={column}>{column}</th>)}</tr>
      </thead>
      <tbody>
        {techs.map(tech =>
          <tr key={tech} >
            <th data-t="s" data-a-h="center">{tech.split(' ')[0]}</th>
            <th style={colorKpd(Average(tech, stats?.kpds))}
              data-t="n" data-fill-color={stylesExcelKpd(Average(tech, stats?.kpds))} data-a-h="center">{Average(tech, stats?.kpds)}</th>
            <th style={colorKpd(Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))}
              data-t="n" data-fill-color={stylesExcelKpd(Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))} data-a-h="center">
              {Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd))}</th>
            <th style={colorKpd(Math.min(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))}
              data-t="n" data-fill-color={stylesExcelKpd(Math.min(...filtredArray(tech, stats?.kpds).map(item => +item.kpd)))} data-a-h="center">
              {Math.min(...filtredArray(tech, stats?.kpds).map(item => +item.kpd))}</th>
            <th data-t="n" data-a-h="center">{stats?.pretensions.filter(p => p.plane_techs.includes(tech)).length}</th>
            <th data-t="n" data-a-h="center">{stats?.repeats.filter(p => p.plane_techs.includes(tech)).length}</th>
            <th data-t="n" data-a-h="center">{stats?.notCompleted.filter(p => p.plane_techs.includes(tech)).length}</th>
            <th data-t="n" data-a-h="center">{Absense(tech, stats?.kpds)}</th>
          </tr>)}
      </tbody>
    </table>
  )
}

export default TableStats;