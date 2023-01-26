import {createEvent, createStore, combine, createEffect} from 'effector'


export const setUser = createEvent();

export const $user = createStore({ID: 0, UF_DEPARTMENT: [199999]}).on(setUser, (_, payload) => payload)


export const getDep = createEffect(async (id) => {
    const url = `getDepForAppTech.php?id=${id}`
    const base = 'https://volga24bot.com/bot';
    const req = await fetch(`${base}/${url}`)

    return req.json()
})



const $bitrixDep = createStore([]).on(getDep.doneData, (_, payload) => payload);


export const $depStatus = combine(
    $bitrixDep, getDep.pending,
    (data, isLoading) => {
        if (isLoading) {
            return []
        } else {
            const last1 = data.pop();
            const galkin = data.pop();
            const last2 = data.pop();
            const last3 = data.pop();
            const first = data.shift();
            const kirishkin = data.shift();
            data.push(first);
            data.push(last1);
            data.push(last2);
            data.push(last3);
            data.unshift(kirishkin);
            data.unshift(galkin);
            return data
        }


    }

)