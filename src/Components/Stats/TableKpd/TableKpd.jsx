
const TableKpd = ({ sd, ed, kpds }) => {
  const techs = Array.from(new Set(kpds?.map(el => el.tech)));
  const days = Array.from(new Set(kpds?.map(el => el.createAt)));

  const colorDay = (day) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return { 'backgroundColor': 'lightblue' };
    return { 'backgroundColor': 'white' };
  }
  const stylesExcelDay = (day) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return "add8e6";
    return;
  }
  const colorKpd = (day, kpd) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return;
    if (+kpd >= 70) return { 'backgroundColor': 'lightgreen' };
    if (+kpd <= 30) return { 'backgroundColor': 'lightsalmon' };
    return { 'backgroundColor': 'white' };
  }
  const stylesExcelKpd = (day, kpd) => {
    if (new Date(day).getDay() === 6
      || new Date(day).getDay() === 0)
      return "add8e6";
    if (+kpd >= 70) return "90EE90";
    if (+kpd <= 30) return "ffa07a";
    return;
  }

  return (
    <table border="1" cellPadding="3" >
      <thead>
        <tr>
          <th style={{ 'width': 60 }}></th>
          {techs.map(tech => <th key={tech} data-t="s" data-a-h="center">{tech.split(' ')[0]}</th>)}
        </tr>
      </thead>
      <tbody>
        {days.map(day =>
          <tr key={day} style={colorDay(day)}>
            <th data-t="s" data-fill-color={stylesExcelDay(day)} data-a-h="center">{day.split('-')[2]}</th>
            {techs.map(tech => kpds?.filter(kpd => kpd.tech === tech && kpd.createAt === day).length === 1
              ? kpds?.filter(kpd => kpd.tech === tech && kpd.createAt === day)
                .map((kpd, id) => <th key={id} style={colorKpd(day, kpd.kpd)}
                  data-t="n" data-fill-color={stylesExcelKpd(day, kpd.kpd)} data-a-h="center">{kpd.kpd}</th>)
              : <th data-t="s" data-a-h="center">x</th>
            )}
          </tr>)}
      </tbody>
    </table>
  )
}

export default TableKpd;