import {getAllReq, getMainReq} from "../state";
import {setLoading} from "../state/loading";

const imMessageAdd = (chatId, message, isSystem = true) => {

  window.bx24?.callMethod('im.message.add', {
    'DIALOG_ID': chatId,
    'MESSAGE': message,
    'SYSTEM': isSystem ? 'Y' : "N",
  });

}


export const updateTask = (form, item) => {
    setLoading(true)
    let formData = new FormData();

    if (form.time !== item[34]) {
      const message = `${item[2]} ${item[4]} изменил время с ${item[34]} на ${form.time}`;
      imMessageAdd('chat3499', message, false);
    }

    for (let key in form) {
        formData.append([key], form[key])
    }
    formData.append('id', item[0])
    fetch('https://volga24bot.com/kartoteka/api/tech/updateTask.php',{

        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            setLoading(false)
            if (res === 1) {
                return true

            } else {
                alert('Произошла ошибка')
            }

        })
        .catch(function(res){ console.log(res) })

}