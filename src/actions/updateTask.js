import {getAllReq, getMainReq} from "../state";
import {setLoading} from "../state/loading";
import {$user} from "../state/user";
import {useStore} from "effector-react";

const imMessageAdd = (chatId, message, isSystem = true) => {

  window.bx24?.callMethod('im.message.add', {
    'DIALOG_ID': chatId,
    'MESSAGE': message,
    'SYSTEM': isSystem ? 'Y' : "N",
  });

}


export const UpdateTask = (form, item) => {
  const user = useStore($user);

    setLoading(true)
    let formData = new FormData();

    if (form.time !== item[34]) {
      const message = `${user.LAST_NAME} ${user.NAME}\n${item[2]} ${item[4]} изменил время с ${item[34]} час на ${form.time} час`;
      imMessageAdd('chat11915', message);
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