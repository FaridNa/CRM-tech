export const setEquipmentHistory = (id, type, value, user, func = () => {}) => {
    let formData = new FormData();

    formData.append('id', id);
    formData.append('type', type);
    formData.append('value', value);
    formData.append('user', user);

    fetch('https://volga24bot.com/kartoteka/api/equipment/pushToEquipmentHistory.php',{
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res) {
                func(res)
            }
        })
}