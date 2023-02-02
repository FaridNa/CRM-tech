import { setLoading } from "../state/loading";
import { setEquipmentHistory } from "./setEquipmentHistory";

export const editEquipment = async (method, form, user) => {
  setLoading(true);

  if (form === null) {
    alert('Ошибка: нет данных для изменения (сообщите Фариду)!!');
    setLoading(false);
    return;
  } else {
    let formData = new FormData();

    if (method === "editStatus") {
      formData.append('method', 'editStatus')
      formData.append('id', form.id)
      formData.append('status', form.status)
    }
    else {
    for (let key in form) { formData.append([key], form[key]) }
    }
    //formData.append('user',user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);
    fetch('https://volga24bot.com/kartoteka/api/equipment/editEquipment.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(res => {
        if (res === "success") {
          
          if(method ==="editStatus"){
            console.log("", "editStatus", `Статус изменен на ${form.status} ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`, user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME)
            setEquipmentHistory(form.id, "editStatus", `Статус изменен на ${form.status} ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`, user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);
          } else {
            setEquipmentHistory(form.id, "edit",`Оборудование изменено ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`,user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);
          }

          alert('Изменено Успешно!');
          setLoading(false)
        } else {
          alert('Ошибка!')
          setLoading(false)
        }
      })
      .catch(function (res) { console.log(res) })
  }

  setLoading(false)
  return true;
}