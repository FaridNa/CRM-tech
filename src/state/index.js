import {createStore, createEffect, combine, createEvent} from 'effector'
import {$nav, $typenav} from "./Nav";
import {filterDep} from "../utils/filterDepartament";
import {$user} from "./user";



export const getNewReq = createEffect(async ({a, b}) => {
    const url = `newTasks.php/?startDate=${a}&endDate=${b}`

    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()
})


const $newReq = createStore({NEW: [], COMP: [], INJOB: [], NC: [], DEFFECT: [], DEFFECT2: {NEW: [], ALL: [], COMP: []}}).on(
    getNewReq.doneData,
    (_, data) => data
)



export const $newReqStatus = combine(
    $newReq, getNewReq.pending,$nav,$typenav,$user,
    (data2, isLoading, typeNav,nav2,user) => {
        if (isLoading) {
            return []
        } else {
            let data = {NEW: data2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                COMP: data2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                INJOB: data2.INJOB.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                NC: data2.NC.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT: data2.DEFFECT.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT2: { NEW: data2.DEFFECT2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), ALL: data2.DEFFECT2.ALL.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), COMP: data2.DEFFECT2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),},
            }




            if (nav2 === 'total') {
                if (typeNav === 'so') {
                    return data.NEW.filter(el => el[8] === 'СО')
                } else if (typeNav === 'req') {
                    return data.NEW.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор')
                } else if (typeNav === 'mon') {
                    return data.NEW.filter(el => el[8] === 'Монтаж')
                } else if (typeNav === 'dem') {
                    return data.NEW.filter(el => el[8] === 'Демонтаж')
                } else if (typeNav === 'connection') {
                    return data.NEW.filter(el => el[3] === 'Нет контрольного события')
                } else if (typeNav === 'repeats') {
                    return data.NEW.filter(el => el[3] === 'Повтор' )
                } else if (typeNav === 'pre') {
                    return data.NEW.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта')
                } else if (typeNav === 'toM') {
                    return data.NEW.filter(el => el[13] === 'Ежемесячное ТО' )
                } else if (typeNav === 'toQ') {
                    return data.NEW.filter(el => el[13] === 'Ежеквартальное ТО')
                } else if (typeNav === 'deffect') {
                    return data.DEFFECT2.NEW
                } else if (typeNav === 'preP') {
                    return data.NEW.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта')
                } else if (typeNav === 'corp') {
                    return data.NEW.filter(el => el[3] === 'Корпоративный')
                }
            } else if (nav2 === 'COMP') {
                if (typeNav === 'so') {
                    return data.COMP.filter(el => el[8] === 'СО')
                } else if (typeNav === 'req') {
                    return data.COMP.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор')
                } else if (typeNav === 'mon') {
                    return data.COMP.filter(el => el[8] === 'Монтаж')
                } else if (typeNav === 'dem') {
                    return data.COMP.filter(el => el[8] === 'Демонтаж' )
                } else if (typeNav === 'connection') {
                    return data.COMP.filter(el => el[3] === 'Нет контрольного события')
                } else if (typeNav === 'repeats') {
                    return data.COMP.filter(el => el[3] === 'Повтор' )
                } else if (typeNav === 'pre') {
                    return data.COMP.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта')
                } else if (typeNav === 'toM') {
                    return data.COMP.filter(el => el[13] === 'Ежемесячное ТО' )
                } else if (typeNav === 'toQ') {
                    return data.COMP.filter(el => el[13] === 'Ежеквартальное ТО')
                } else if (typeNav === 'deffect') {
                    return data.DEFFECT2.COMP
                } else if (typeNav === 'preP') {
                    return data.COMP.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта')
                } else if (typeNav === 'corp') {
                    return data.COMP.filter(el => el[3] === 'Корпоративный')
                }
            } else if (nav2 === 'INJOB') {
                if (typeNav === 'so') {
                    return data.INJOB.filter(el => el[8] === 'СО')
                } else if (typeNav === 'req') {
                    return data.INJOB.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор')
                } else if (typeNav === 'mon') {
                    return data.INJOB.filter(el => el[8] === 'Монтаж')
                } else if (typeNav === 'dem') {
                    return data.INJOB.filter(el => el[8] === 'Демонтаж' )
                } else if (typeNav === 'connection') {
                    return data.INJOB.filter(el => el[3] === 'Нет контрольного события')
                } else if (typeNav === 'repeats') {
                    return data.INJOB.filter(el => el[3] === 'Повтор' )
                } else if (typeNav === 'pre') {
                    return data.INJOB.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта')
                } else if (typeNav === 'toM') {
                    return data.INJOB.filter(el => el[13] === 'Ежемесячное ТО' )
                } else if (typeNav === 'toQ') {
                    return data.INJOB.filter(el => el[13] === 'Ежеквартальное ТО')
                } else if (typeNav === 'preP') {
                    return data.INJOB.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта')
                } else if (typeNav === 'corp') {
                    return data.INJOB.filter(el => el[3] === 'Корпоративный')
                }
            } else if (nav2 === 'NEW') {
                if (typeNav === 'so') {
                    return data.NC.filter(el => el[8] === 'СО')
                } else if (typeNav === 'req') {
                    return data.NC.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор')
                } else if (typeNav === 'mon') {
                    return data.NC.filter(el => el[8] === 'Монтаж')
                } else if (typeNav === 'dem') {
                    return data.NC.filter(el => el[8] === 'Демонтаж' )
                } else if (typeNav === 'connection') {
                    return data.NC.filter(el => el[3] === 'Нет контрольного события')
                } else if (typeNav === 'repeats') {
                    return data.NC.filter(el => el[3] === 'Повтор' )
                } else if (typeNav === 'pre') {
                    return data.NC.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта')
                } else if (typeNav === 'toM') {
                    return data.NC.filter(el => el[13] === 'Ежемесячное ТО' )
                } else if (typeNav === 'toQ') {
                    return data.NC.filter(el => el[13] === 'Ежеквартальное ТО')
                } else if (typeNav === 'deffect') {
                    return data.DEFFECT2.ALL
                } else if (typeNav === 'preP') {
                    return data.NC.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта')
                } else if (typeNav === 'corp') {
                    return data.NC.filter(el => el[3] === 'Корпоративный')
                }
            } else if (nav2 === 'DEFFECT') {
                if (typeNav === 'so') {
                    return data.DEFFECT.filter(el => el[8] === 'СО')
                } else if (typeNav === 'req') {
                    return data.DEFFECT.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор')
                } else if (typeNav === 'mon') {
                    return data.DEFFECT.filter(el => el[8] === 'Монтаж')
                } else if (typeNav === 'dem') {
                    return data.DEFFECT.filter(el => el[8] === 'Демонтаж' )
                } else if (typeNav === 'connection') {
                    return data.DEFFECT.filter(el => el[3] === 'Нет контрольного события')
                } else if (typeNav === 'repeats') {
                    return data.DEFFECT.filter(el => el[3] === 'Повтор' )
                } else if (typeNav === 'pre') {
                    return data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта')
                } else if (typeNav === 'toM') {
                    return data.DEFFECT.filter(el => el[13] === 'Ежемесячное ТО' )
                } else if (typeNav === 'toQ') {
                    return data.DEFFECT.filter(el => el[13] === 'Ежеквартальное ТО')
                } else if (typeNav === 'deffect') {
                    return data.DEFFECT2.ALL
                } else if (typeNav === 'preP') {
                    return data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта')
                } else if (typeNav === 'corp') {
                    return data.DEFFECT.filter(el => el[3] === 'Корпоративный')
                }
            }
        }
    }
)

export const $counters = combine(
    $newReq, getNewReq.pending,$user,
    (data2, isLoading, user) => {

        if (isLoading) {
            return {NEW: [], COMP: [], INJOB: [], NC: [], DEFFECT: []}
        } else {

            let data = {NEW: data2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                COMP: data2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                INJOB: data2.INJOB.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                NC: data2.NC.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT: data2.DEFFECT.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT2: { NEW: data2.DEFFECT2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), ALL: data2.DEFFECT2.ALL.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), COMP: data2.DEFFECT2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),},
            }

            const NEW = {
                req: data.NEW.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.NEW.filter(el => el[8] === 'Монтаж').length,
                dem: data.NEW.filter(el => el[8] === 'Демонтаж').length,
                so: data.NEW.filter(el => el[8] === 'СО').length,
                pre: data.NEW.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.NEW.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.NEW.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.NEW.filter(el => el[3] === 'Повтор').length,
                connection: data.NEW.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.NEW.length,
                preP: data.NEW.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.NEW.filter(el => el[3] === 'Корпоративный').length,
            }

            const DEFFECT = {
                req: data.DEFFECT.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.DEFFECT.filter(el => el[8] === 'Монтаж').length,
                dem: data.DEFFECT.filter(el => el[8] === 'Демонтаж').length,
                so: data.DEFFECT.filter(el => el[8] === 'СО').length,
                pre: data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.DEFFECT.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.DEFFECT.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.DEFFECT.filter(el => el[3] === 'Повтор').length,
                connection: data.DEFFECT.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.ALL.length,
                preP: data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.DEFFECT.filter(el => el[3] === 'Корпоративный').length,
            }
            const NC = {
                req: data.NC.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.NC.filter(el => el[8] === 'Монтаж').length,
                dem: data.NC.filter(el => el[8] === 'Демонтаж').length,
                so: data.NC.filter(el => el[8] === 'СО').length,
                pre: data.NC.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.NC.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.NC.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.NC.filter(el => el[3] === 'Повтор').length,
                connection: data.NC.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.ALL.length,
                preP: data.NC.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.NC.filter(el => el[3] === 'Корпоративный').length,
            }
            const COMP = {
                req: data.COMP.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.COMP.filter(el => el[8] === 'Монтаж').length,
                dem: data.COMP.filter(el => el[8] === 'Демонтаж').length,
                so: data.COMP.filter(el => el[8] === 'СО').length,
                pre: data.COMP.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.COMP.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.COMP.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.COMP.filter(el => el[3] === 'Повтор').length,
                connection: data.COMP.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.COMP.length,
                preP: data.COMP.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.COMP.filter(el => el[3] === 'Корпоративный').length,
            }
            const INJOB = {
                req: data.INJOB.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.INJOB.filter(el => el[8] === 'Монтаж').length,
                dem: data.INJOB.filter(el => el[8] === 'Демонтаж').length,
                so: data.INJOB.filter(el => el[8] === 'СО').length,
                pre: data.INJOB.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.INJOB.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.INJOB.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.INJOB.filter(el => el[3] === 'Повтор').length,
                connection: data.INJOB.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: 0,
                preP: data.INJOB.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.INJOB.filter(el => el[3] === 'Корпоративный').length,
            }
            return {INJOB: INJOB, COMP: COMP, NC: NC, DEFFECT: DEFFECT, NEW:NEW}
        }
    }
)




export const getAllReq = createEffect(async () => {
    const url = `getAllReq.php/`

    const base = 'https://volga24bot.com/kartoteka/api'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $allReq = createStore([]).on(
    getAllReq.doneData,
    (_, data) => data
)

export const $allReqStatus = combine(
    $allReq, getAllReq.pending, $user,
    (data, isLoading,user) => {

        if (isLoading) {
            return []
        } else {
            return data.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]));
        }
    }
)

export const $notCompCount = combine(
    $allReq, getAllReq.pending,$user,
    (data2, isLoading, user) => {
        if (isLoading) {
            return []
        } else {
            let data = data2.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]));

            const conn = data.filter((el) => el[3] === 'Нет контрольного события');

            let numbers = [];


            return {
                req: data.filter(el => el[8] === 'Заявка').length,
                mon: data.filter(el => el[8] === 'Монтаж').length,
                dem: data.filter(el => el[8] === 'Демонтаж').length,
                so: data.filter(el => el[8] === 'СО').length,
                pre: data.filter(el => el[8] === 'Претензия').length,
                toM: data.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.filter(el => el[3] === 'Повтор').length,
                connection: conn.filter(el => {
                    if (!numbers.includes(el[1])) {
                        numbers.push(el[1])
                        return true
                    }
                }).length
            }
        }
    }
)
