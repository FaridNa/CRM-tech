import {getAllReq, getMainReq} from "../state";
import {setLoading} from "../state/loading";

export const updateTask = (form, id) => {
    setLoading(true)
    let formData = new FormData();

    for (let key in form) {
        formData.append([key], form[key])
    }
    formData.append('id', id)
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