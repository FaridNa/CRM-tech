import { setLoading } from "../state/loading";
import { setEquipmentHistory } from "./setEquipmentHistory";

export const createEquipment = async (form, user) => {
  setLoading(true);

  if (form === null) {
    alert('Ошибка (сообщите Фариду)!!');
    setLoading(false);
    return;
  } else {
    let formData = new FormData();
    for (let key in form) { formData.append([key], form[key]) }
    formData.append('user',user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);

  // console.log("", 
  // "create",
  // `Оборудование создано ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`,
  // user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);

    fetch('https://volga24bot.com/kartoteka/api/equipment/editEquipment.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res === 'success') {
          //setEquipmentHistory("", "create",`Оборудование создано ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`,user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);
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