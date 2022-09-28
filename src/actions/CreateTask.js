import { getAllReq, getMainReq, getNewReq } from "../state";
import { setLoading } from "../state/loading";

const isFreeTime = (tasks, newTask) => {
  const newTaskDate = new Date(newTask.date).getTime();
  const newNext = newTaskDate + 1 * 60 * 60 * 1000;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskDate = new Date(task[56] + ' ' + task[57]).getTime();
    const next = taskDate + 1 * 60 * 60 * 1000;

    if (newTaskDate < next && newNext > taskDate) {
      return false;
    }
  }
  return true;
}

export const createTask = (form, func, firstTime, secondTime, user, plane, graph) => {

  setLoading(true);
  if (form.date === '') {
    form.date = new Date().toLocaleDateString('en-CA') + 'T' + new Date().toLocaleTimeString();
  }
  if (form.customer) {
    // plane - новые и просроченные
    // graph - в работе и выполненные
    // 56 - дата
    // 57 - время
    // 34 - время работ

    const tasks = [...new Set([
      ...(plane.filter(el => el[42] === form.customer)),
      ...(plane.filter(el => el[55] === form.customer))
    ]), ...new Set([
      ...(graph.filter(el => el[42] === form.customer)),
      ...(graph.filter(el => el[55] === form.customer))
    ])];

    const is = isFreeTime(tasks, form);

    if (is === false) {
      alert('На это время у выбранного техника уже запланирована работа. Выберите другую дату и время!!');
      setLoading(false);
      return;
    }
  }

  let formData = new FormData();
  for (let key in form) {
    if (key !== 'files') {
      formData.append([key], form[key])
    } else {
      for (let i = 0; i < form.files.length; i++) {
        formData.append([form.files[i].name], form.files[i])
      }
    }
  }



  if (form.type === 'Нет контрольного события') {
    formData.append('type', 'Заявка')
    formData.append('type2', form.type)
    formData.append('comment', `${form.type} с ${form.comment}`)
  }


  if (form.label === "Претензия от пульта") {
    formData.append('type2', 'От пульта')
  }
  formData.append("creatorID", user.ID)
  formData.append("creatorName", `${user.LAST_NAME} ${user.NAME[0]}.${user.SECOND_NAME[0] ? user.SECOND_NAME[0] : ''}`)


  if (form.type === 'СО') {
    fetch('https://volga24bot.com/bot/createSoLead.php?application_token=2ac721c25667b3e8f30e782b9dca97fd', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        formData.append('crm', res.result)
        fetch('https://volga24bot.com/kartoteka/api/tech/createMarkTask.php', {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            if (res === 'success') {
              alert('Задача создана');
              getNewReq({ 'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth() + 1) : secondTime.getMonth() + 1}-${secondTime.getDate()} 00:00:01` });

              func();
              setLoading(false)
            } else {
              alert('Задача не создана')
              setLoading(false)
            }
          })
          .catch(function (res) { console.log(res) })


      })
      .catch(function (res) { console.log(res) })
  } else {
    fetch('https://volga24bot.com/kartoteka/api/tech/createMarkTask.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res === 'success') {
          alert('Задача создана');
          getNewReq({ 'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth() + 1) : secondTime.getMonth() + 1}-${secondTime.getDate()} 00:00:01` });
          func();
          setLoading(false)
        } else {
          alert('Задача не создана')
          setLoading(false)
        }
      })
      .catch(function (res) { console.log(res) })
  }




}

