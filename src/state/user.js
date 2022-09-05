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

            return data
        }


    }

)