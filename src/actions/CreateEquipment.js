import { setLoading } from "../state/loading";

export const createEquipment = async (form) => {
    
    function randomNumberInRange(min, max) {
        // 👇️ get number between min (inclusive) and max (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    setLoading(true);

    if (form.name === '') {
      alert('Необходимо указать имя оборудования!!');
      setLoading(false);
      return;
    }
  
    if (form.techName === '') {
        alert('Необходимо указать техника!!');
        setLoading(false);
        return;
    }

    let formData = new FormData();
    for (let key in form) {
        key!=="id"?
        formData.append([key], form[key])
        :formData.append("id", randomNumberInRange(100,1000000))
      }

    //   const base = 'https://volga24bot.com/kartoteka/api/equipment';
    //   const url = `createEquipment.php/?objNum=${form.objNum}`;

    //   const response = await fetch(`${base}/${url}`).then(res => res.json());
    //   if (response.results !== false) {
    //     if (response.object !== null)
    //     form.customer = response.object.customer;
    //   }




    
      
    console.log(formData)
    fetch('https://volga24bot.com/kartoteka/api/equipment/createEquipment.php', {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(res => {
          if (res === 'success') {
            alert('Оборудование создано');
            setLoading(false)
          } else {
            alert('Ошибка!')
            setLoading(false)
          }
        })
        .catch(function (res) { console.log(res) })
    
    setLoading(false)
    
    return true;
}